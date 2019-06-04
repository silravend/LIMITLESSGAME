import { Api, Rpc, RpcError, JsSignatureProvider } from "eosjs2";
import ScatterJS, { Network } from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs2";
ScatterJS.plugins(new ScatterEOS());

const network = Network.fromJson({
    blockchain: "eos",
    host: "nodes.get-scatter.com",
    port: 443,
    protocol: "https",
    chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906" // <-- this is the MAINNET
});

// const network = Network.fromJson({
//     blockchain: "eos",
//     host: "jungle2.cryptolions.io",
//     port: 80,
//     protocol: "http",
//     chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473" // <-- this is the tesetnet
// });

const rpc = new Rpc.JsonRpc(network.fullhost());

class ScatterService {
    scatter = null;
    account = null;
    eos = null;
    constructor({ name = "xiongzhend13" } = {}) {
        this.name = name;
    }

    async checkConnected() {
        const connected = await ScatterJS.scatter.connect("limitless");

        if (connected) {
            this.scatter = ScatterJS.scatter

            this.eos = this.scatter.eos(network, Api, { rpc })
            window.ScatterJS = null
        }

        return connected;
    }

    async login() {
        const connected = await this.checkConnected();
        if (!connected) return -1;

        const requiredFields = { accounts: [network] };

        await this.scatter.login(requiredFields);
        this.account = this.scatter.identity.accounts.find(
            x => x.blockchain === "eos"
        );

        return this.account
    }

    logout() {
        this.scatter.logout();
    }

    async takeAction (action, dataValue) {
        const resultWithConfig = await this.eos.transact(
            {
                actions: [
                    {
                        account: this.name,
                        name: action,
                        authorization: [
                            {
                                actor: this.account.name,
                                permission: this.account.authority
                            }
                        ],
                        data: dataValue
                    }
                ]
            },
            {
                blocksBehind: 3,
                expireSeconds: 30
            }
        );
        return resultWithConfig
    }

    async getJackpot () {
        let ret = await rpc.get_table_rows({
            code: this.name,
            scope: this.name,
            table: "globals",
            limit: 1
        })
        return ret.rows[0].jackpot / 10000
    }

    async bet({betMask, id, commit, commitLastBlock, r, s}, amount) {
        const tokenDetails = {contract:'eosio.token', symbol:'EOS', memo:`${betMask}-${id}-${commit}-${commitLastBlock}-${r}-${s}`, decimals:4};
        const res = await this.scatter.requestTransfer(network, this.name, `${amount} EOS`, tokenDetails)
        return res
    }

    async getBalance() {
        const balance = await rpc.get_currency_balance(
            "eosio.token",
            this.account.name,
            "EOS"
        );
        console.log(balance)
        return balance[0].split(" ")[0];
    }
}

export default ScatterService;
