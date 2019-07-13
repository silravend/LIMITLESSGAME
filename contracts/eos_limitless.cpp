#include "limitless.hpp"

void limitless::transrecv(const name from, const name to, const asset quantity, const std::string memo)
{
    if (from == get_self()) //You can't transfer to yourself
    {
        return;
    }

    check(from != to, "Invalid transfer from as same as to.");
    require_auth(from);
    check(is_account(to), "To account is not exist.");

    check(quantity.symbol.code().is_valid(), "Invalid quantity symbol code.");
    check(quantity.symbol.code() == symbol_code("EOS"), "Invalid symbol, accept EOS only.");
    check(quantity.is_valid(), "Invalid quantity.");

    std::vector<std::string> v;
    split_string(memo, v, "-");

    send_placebet(
        from,
        quantity.amount,
        atoi(v[1].c_str()),
        v[2],
        atoi(v[0].c_str()),
        atoi(v[3].c_str())
    );
}

void limitless::placebet(const name gambler, const uint64_t amount, const uint64_t id, const std::string commitment, const uint64_t mask, const uint64_t commitlastblock)
{
    require_auth(get_self());

    bet_index bets(get_self(), get_first_receiver().value);
    auto iterator1 = bets.find(id);
    if (iterator1 == bets.end())
    {
        check(amount >= 100 && amount <= 200000000, "Amount should be within range.");
        check(mask > 0 && mask < 100, "Mask should be within range.");
        check(commitlastblock >= 32000000, "Commit block height should be within range.");

        bets.emplace(get_self(), [&]( auto& row) {
            row.id = id;
            row.gambler = gambler;
            row.commitment = commitment;
            row.amount = amount;
            row.rollUnder = mask;
            row.commitlastblock = commitlastblock;
        });

        global_index globals(get_self(), get_first_receiver().value);
        auto iterator2 = globals.find(get_self().value);
        if (iterator2 == globals.end())
        {
            globals.emplace(get_self(), [&]( auto& row) {
                row.key = get_self();
                row.max_profit = 0;
                row.jackpot = 0;
                row.description1 = "";
                row.description2 = "";
            });
        }
        else
        {
            globals.modify(iterator2, get_self(), [&]( auto& row) {
                row.key = get_self();
                row.max_profit = 0;
                row.jackpot += amount * 0.01 > 10 ? amount * 0.01 : 10;
                row.description1 = "";
                row.description2 = "";
            });
        }
    }
}

void limitless::placebetfree(const name gambler, const uint64_t amount, const std::string memo)
{
    require_auth(gambler);

    person_index people(get_self(), get_first_receiver().value);
    auto iterator2 = people.find(0);
    check(iterator2 != people.end(), "User is not in the list.");

    std::vector<std::string> v;
    split_string(memo, v, "-");

    uint64_t id = atoi(v[1].c_str());
    std::string commitment = v[2];
    uint64_t mask = atoi(v[0].c_str());
    uint64_t commitlastblock = atoi(v[3].c_str());

    bet_index bets(get_self(), get_first_receiver().value);
    auto iterator1 = bets.find(id);
    if (iterator1 == bets.end())
    {
        check(amount >= 100 && amount <= 500, "Amount should be within range.");
        check(mask > 0 && mask < 100, "Mask should be within range.");
        check(commitlastblock >= 32000000, "Commit block height should be within range.");

        people.modify(iterator2, get_self(), [&]( auto& row) {
            row.id = 0;
            check(row.gambler_name == gambler.to_string(), "User is not in the list.");
            check(row.amount == amount, "Amount is not correct.");
            row.gambler_name = "";
        });

        bets.emplace(get_self(), [&]( auto& row) {
            row.id = id;
            row.gambler = gambler;
            row.commitment = commitment;
            row.amount = amount;
            row.rollUnder = mask;
            row.commitlastblock = commitlastblock;
        });

        // erase gambler
        people.erase(iterator2);
    }
}

void limitless::settlebet(const name beneficiary, const uint64_t id, const asset &quantity)
{
    require_auth(get_self());

    bet_index bets(get_self(), get_first_receiver().value);
    auto iterator1 = bets.find(id);
    if (iterator1 != bets.end())
    {
        bets.modify(iterator1, get_self(), [&]( auto& row) {
            check(quantity.is_valid(), "Invalid quantity");
            check(quantity.amount > 0, "Must settle positive quantity.");
            check(quantity.amount < row.amount * 100 / row.rollUnder, "You are crazy dog.");
            check(row.amount > 0, "Insufficient amount.");
            check(row.gambler == beneficiary, "Beneficiary should be the same as gambler.");
            row.amount = 0;

            action(
                permission_level{get_self(), "active"_n},
                "eosio.token"_n,
                "transfer"_n,
                std::make_tuple(get_self(), beneficiary, quantity, std::string("Congratulations!"))
            ).send();
        });
    }
}

extern "C"
{
    void apply(uint64_t receiver, uint64_t code, uint64_t action)
    {
        if (code == "eosio.token"_n.value && action == "transfer"_n.value)
        {
            eosio::execute_action(eosio::name(receiver), eosio::name(code), &limitless::transrecv);
        }
        else if (code == receiver)
        {
            switch (action)
            {
                EOSIO_DISPATCH_HELPER(limitless, (placebet)(placebetfree)(settlebet) )
            }
        }
        eosio_exit(0);
    }
}