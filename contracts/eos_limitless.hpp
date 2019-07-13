#include <string>
#include <eosio/eosio.hpp>
#include <eosio/transaction.hpp>
#include <eosio/asset.hpp>

using namespace eosio;

CONTRACT limitless : public eosio::contract
{

    using contract::contract;

    public:
        limitless(name receiver, name code, datastream<const char*> ds): contract(receiver, code, ds) {}

        ACTION transrecv(const name from, const name to, const asset quantity, const std::string memo);

        using bet_action = action_wrapper<"bets"_n, &limitless::transrecv>;

        ACTION placebet(const name gambler, const uint64_t amount, const uint64_t id, const std::string commitment, const uint64_t mask, const uint64_t commitlastblock);

        ACTION placebetfree(const name gambler, const uint64_t amount, const std::string memo);

        ACTION settlebet(const name beneficiary, const uint64_t id, const asset &quantity);

    private:
        struct [[eosio::table]] global
        {
            name key;
            uint64_t max_profit;
            uint64_t jackpot;
            std::string description1;
            std::string description2;

            uint64_t primary_key() const { return key.value; }
        };

        typedef eosio::multi_index<"globals"_n, global> global_index;

        struct [[eosio::table]] person
        {
            // identity
            uint64_t id;
            // Address of a gambler, used to pay out winning bets.
            std::string gambler_name;
            // Wager amount in decimal 8.
            uint64_t amount;

            uint64_t primary_key() const { return id; }
        };

        typedef eosio::multi_index<"people"_n, person> person_index;

        struct [[eosio::table]] bet
        {
            // identity
            uint64_t id;
            // Address of a gambler, used to pay out winning bets.
            name gambler;
            // reveal hash -> commitment
            std::string commitment;
            // Wager amount in decimal 8.
            uint64_t amount;
            // Number of winning outcomes, used to compute winning payment (* modulo/rollUnder),
            // and used instead of mask for games with modulo > MAX_MASK_MODULO.
            uint64_t rollUnder;
            // commit last block
            uint64_t commitlastblock;

            uint64_t primary_key() const { return id; }
        };

        typedef eosio::multi_index<"bets"_n, bet> bet_index;

        void send_placebet(const name gambler, const uint64_t amount, const uint64_t id, const std::string commitment, const uint64_t mask, const uint64_t commitlastblock)
        {
            action(
                permission_level{get_self(), "active"_n},
                get_self(),
                "placebet"_n,
                std::make_tuple(gambler, amount, id, commitment, mask, commitlastblock)
            ).send();
        }

        void split_string(const std::string &s, std::vector<std::string>& v, const std::string &c)
        {
            std::string::size_type pos1, pos2;
            pos2 = s.find(c);
            pos1 = 0;
            while (std::string::npos != pos2)
            {
                v.push_back(s.substr(pos1, pos2-pos1));

                pos1 = pos2 + c.size();
                pos2 = s.find(c, pos1);
            }
            if (pos1 != s.length())
            {
                v.push_back(s.substr(pos1));
            }
        }
};