<template>
    <div class="" id="app">
        <game
            ref="app"
            symbol="ETH"
            :num.sync="num"
            :amount.sync="amount"
            :minAmount="minAmount"
            :maxAmount="maxAmount"
            :amountStep="amountStep"
            :balance="balance"
            :gas="gas"
            :betLoading="betLoading"
            :recordList="recordList"
            :myRecordList="myRecordList"
            :adRecordList="adRecordList"
            :jackpotStart="jackpotStart"
            :jackpotEnd="jackpotEnd"
            :state="state"
            :result="result"
            :loading="loading"
            :celebrateVisible="celebrateVisible"
            :min="min"
            :max="max"
            @bet="betSubmit"
            @ended="betEnd"
            @addRecord="addRecord"
        >
        </game>
    </div>
</template>

<script>
import { getGasPrice, getBetParams, settleBet, getRecord, getMyRecord, getAmountParams, getHighRoller } from "@/api/dice_eth"
import { sliceNumber, foldString } from '@/js/utils'
import Game from './Game.vue'
import { calcEthReward, calcLossPer } from '@/js/game'
import { eth as getContract, ethSettle as getSettleContract } from "@/js/contract"
import { eth as ethAddr } from '@/js/address_config'
import ScatterService from '@/js/eos'

import { Api, JsonRpc, RpcError, JsSignatureProvider } from 'eosjs'
import ScatterJS, { Network } from 'scatterjs-core'
import ScatterEOS from 'scatterjs-plugin-eosjs2'
ScatterJS.plugins(new ScatterEOS())

let scatter
let contract, settleContract

const network = Network.fromJson({
    blockchain:'eos',
    host:'nodes.get-scatter.com',
    port:443,
    protocol:'https',
    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906' // <-- this is the MAINNET
});
// Notice that our eosjs reference isn't reactive ( in the data() method like the rest ).
// You don't want to set it onto the data of this component,
// but you CAN set it as a VUEX state property if you wanted.
let eos;
const rpc = new JsonRpc(network.fullhost());

export default {
    data() {
        return {
            num: 50,
            balance: 0,
            amount: 0.01,
            gas: "",
            betLoading: false,
            account: "",
            recordList: [],
            myRecordList: [],
            adRecordList: [],
            jackpotStart: 0,
            jackpotEnd: 0,
            minAmount: 0.01,
            maxAmount: 10.02,
            amountStep: 0.01,
            result: {},
            state:"bet",
            loading: true,
            celebrateVisible: false,
            min:1,
            max: 97,
            debug: false
        };
    },
    components: {
       Game
    },

    watch: {
        amount () {
            this.fixAmount()
        }
    },

    computed: {
      
    },

    async created() {
        const ss = new ScatterService()
        const account = await ss.login()
        if (account == -1) {
            console.log('未检测到Scatter')
            return;
        }
        
        this.account = account.name
        this.balance = await ss.getBalance()
        this.loading = false


        this.getRecord()
        this.getAmoutParams()
        this.getHighRoller()
    },

    async mounted () {
        

    
        return;
        
        this.getMyRecord()

        //获取油费
        const gasRes = await getGasPrice()
        this.gas = gasRes.gasPrice
        
        contract = getContract(this.account)
        settleContract = getSettleContract(this.account)

        this.getJackpot()
        setInterval(() => {
            this.getJackpot()
        }, 10000)
        
    },

    methods: {
        async getAmoutParams () {
            const res = await getAmountParams()
            if (res === null) return;
            
            this.amount = res.defaultAmount
            this.minAmount = res.defaultAmount
            this.maxAmount = res.maxAmount
            this.amountStep = res.step
        },
        
        async getJackpot () {
            this.jackpotStart = this.jackpotEnd
            // const res = await contract.methods.jackpotSize().call()
            const res = await web3.eth.getBalance(ethAddr)

            this.jackpotEnd = sliceNumber(web3.utils.fromWei(res))
        },

        fixAmount() {
            let num = parseFloat(this.amount)
            if (isNaN(num)) {
                this.amount = "0.01";
            } else {
                if (num < 0.01) {
                    num = 0.01;
                } else if (num > 10.2) {
                    num = 10.2;
                }
                this.$nextTick(() => {
                    this.amount = num.toFixed(2);
                })
            }
        },

        async getBetParams () {
            const ready = async () => {
                this.amountCache = this.amount
                this.numCache = this.num
                const res = await getBetParams({
                    betmask: this.num,
                    amount:  this.amount,
                    address: this.account
                })

                if (res === null) {
                    this.betLoading = false;
                    return 
                }
                return res
            }

            let params = await ready()
            
            // 如果v的值为28，则重新请求
            while(params.v == 28) {
                params = await ready()
            }

            return params
        },

        settle (randomNumber,blockHash) {
            settleBet({
                randomNumber: randomNumber,
                hash: blockHash
            })
        },

        betEnd () {
            this.getBalance()
            this.state = 'bet'
            this.betLoading = false
        },

        async getResult (id, blockHash) {
            let result = await settleContract.methods.getInfo(id, blockHash).call()

            const sha3Mod100 = parseInt(result[1].toString()) || 100
            const wins = sliceNumber(calcEthReward(this.amountCache, this.numCache))
            

            return { sha3Mod100, wins }
        },

        // 手动提前计算
        async manualSettle (id, blockHash) {
            const { sha3Mod100, wins } = await this.getResult(id, blockHash)

            this.result = {
                sha3Mod100: sha3Mod100,
                wins: sha3Mod100 < this.numCache ? wins : 0
            }

            this.state = 'wait'
            
            setTimeout(() => {
                this.state = 'result'
            }, 5000)
        },

        submitVerify () {
            if (window.ethereum.networkVersion != 1 && !this.debug) {
                this.$error(this.$t('ax'), 5000)
                return false
            }

            if (!window.ethereum.selectedAddress) {
                this.$warn(this.$t('as'))
                return false
            }

            if (this.amount > this.balance) {
                this.$warn(this.$t('at'))
                return false
            }
            return true
        },

        async betSubmit() {
            if (!this.submitVerify()) return;

            this.betLoading = true
            const params = await this.getBetParams()
            
            contract.methods.placeBet(params.betMask, params.modulo, params.commitLastBlock, params.commit, params.r, params.s).send({
                gas: '150000',
                gasPrice: web3.utils.toWei(this.gas + '', 'gwei'),
                from: this.account,
                value: web3.utils.toWei(this.amount + '', "ether")
            }).catch( err => {
                if (err.message.indexOf('User denied') > -1) {
                    this.$error(this.$t('au'))
                } else {
                    this.$error(this.$t('av'))
                }

                this.betLoading = false
            })

            contract.once('Commit', {

            }, async (error, event) => {
                this.settle( params.id, event.blockHash)
                this.manualSettle(params.id, event.blockHash)
            })
        },

        prefixRecord (item) {
            item._update = this.formatDate(item.updatedAt)
            item._wins = sliceNumber(item.wins)
            item._link = `https://etherscan.io/tx/${item.betTrx}`
            item._bet = item.betMask
            item._result = `<div class="result-num">${item.sha3Mod100}</div>`
        },

        async getRecord () {
            const res =  await getRecord()
            if (res === null) return;

            res.forEach(item => {
                this.prefixRecord(item)
            })
            
            this.recordList = res
        },

        async getMyRecord () {
            const res =  await getMyRecord({
                address: this.account
            })
            if (res === null) return;
            res.forEach(item => {
                this.prefixRecord(item)
            })

            this.myRecordList = res
        },

        addRecord (res) {
            this.prefixRecord(res)
            this.recordList.unshift(res)
            if (res.address == this.account) {
                this.myRecordList.unshift(res)
            }

            if (this.recordList.length > 20) {
                this.recordList.pop()
            }
            if (this.myRecordList.length > 20) {
                this.myRecordList.pop()
            }
        },

        formatDate(dateString) {
            let date = new Date(dateString)
            let s = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            return s.replace(/(\b\d\b)/g, '0$1')
        },

        async getHighRoller () {
            const res = await getHighRoller()
            if (res === null) return;
            
            res.forEach(item => {
                item._lossPer = calcLossPer({min: this.min, max: this.max, bet: item.betMask})
                item._shortcutAddr = foldString(item.address)
            })

            this.adRecordList = res
        }
    }
};
</script>

<style lang="scss">

</style>
