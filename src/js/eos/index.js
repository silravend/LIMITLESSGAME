import { Api, JsonRpc, RpcError, JsSignatureProvider } from 'eosjs'
import ScatterJS, { Network } from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs2'
ScatterJS.plugins(new ScatterEOS())

const network = Network.fromJson({
    blockchain:'eos',
    host:'nodes.get-scatter.com',
    port:443,
    protocol:'https',
    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' // <-- this is the MAINNET
})

const rpc = new JsonRpc(network.fullhost())


class ScatterService {
    scatter = null
    account = null
    eos = null
    constructor () {
        
    }

    async checkConnected () {
        const connected = await ScatterJS.scatter.connect("limitless")

        if (connected) {
            this.scatter = ScatterJS.scatter
            this.eos = this.scatter.eos(network, Api, {rpc})
            console.log(this.eos)
            window.ScatterJS = null
        }

        return connected
    }

    async login () {
        const connected = await this.checkConnected()
        if (!connected) return -1;

        const requiredFields = { accounts:[network] }
        try {
            await this.scatter.login(requiredFields)
            this.account = this.scatter.identity.accounts.find(x => x.blockchain === 'eos');
        
            return this.account

        } catch (error) {
            console.log(error);
        }
    }

    logout () {
        this.scatter.logout()
    }

    
    async getBalance () {
        const balance = await rpc.get_currency_balance('eosio.token', this.account.name, 'EOS')
        return balance[0].split(' ')[0]
    }
}

export default ScatterService