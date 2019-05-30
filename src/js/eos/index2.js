import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';

console.log(Eos)

// Don't forget to tell ScatterJS which plugins you are using.
ScatterJS.plugins( new ScatterEOS() );

// Networks are used to reference certain blockchains.
// They let you get accounts and help you build signature providers.
const network = {
    blockchain:'eos',
    protocol:'https',
    host:'nodes.get-scatter.com',
    port:443,
    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
}

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
            this.scatter = ScatterJS.scatter;
            
            window.ScatterJS = null;
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

        this.eos = this.scatter.eos(network, Eos, { expireInSeconds:60 });
        console.log(this.eos);

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

    async bet() {
        // const res = await this.eos.contract(this.name);
        console.log(this.eos.contracts())
        return

        try {
            const res = await this.takeAction('replacebet', {
                from: this.account.name,
                quantity: '0.001 EOS'
            })
            console.log(res)
        } catch (err) {
            console.error(err)
        }
        
    }

    async getBalance() {
        const balance = await rpc.get_currency_balance(
            "eosio.token",
            this.account.name,
            "EOS"
        );
        return balance[0].split(" ")[0];
    }
}

export default ScatterService;
