<template>
    <div class="" id="app">
        <game
            ref="app"
            symbol="ETH"
            :num.sync="num"
            :amount.sync="amount"
            :introVisible.sync="introVisible"
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
import { sliceNumber, foldString, tryDo } from '@/js/utils'
import Game from './Game.vue'
import { calcEthReward, calcLossPer } from '@/js/game'
import EthService from '@/js/eth'

const eth = new EthService()

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
            debug: false,
            introVisible: false
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
        this.getRecord()
        this.getAmoutParams()
        this.getHighRoller()
    },

    async mounted () {
        if (!eth.checkInstalled()) {
            this.introVisible = true
            return;
        }
        
        setTimeout(() => {
            if (!eth.checkMainNet() && !this.debug ){
                this.$error(this.$t('ax'), 5000)
                return;
            }
            if (!eth.checkAddress()) {
                this.$warn(this.$t('as'), 5000)
            }
        }, 1500)
        

        //获取账户
        const [account, err] = await tryDo(eth.getAccount())
        if (err) {
            if (err.code == 4001) {
                this.$warn(this.$t('au'))
            }
            return 
        }

        this.account = account
        this.getBalance()
        this.loading = false
        this.getMyRecord()

        //获取油费
        const gasRes = await getGasPrice()
        this.gas = gasRes.gasPrice

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

        async getBalance () {
            this.balance = await eth.getBalance()
        },
        
        async getJackpot () {
            this.jackpotStart = this.jackpotEnd

            this.jackpotEnd = await eth.getJackpot()
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
            const sha3Mod100 = await eth.getResult(id, blockHash)
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
            
            const [event, err] = await tryDo(eth.bet(params, this.gas, this.amount))
            if (err) {
                console.log('bet err')
                console.log(err)
                if (err.message.indexOf('User denied') > -1) {
                    this.$error(this.$t('au'))
                } else {
                    this.$error(this.$t('av'))
                }
                this.betLoading = false
                return
            }
            console.log('commit')
            this.settle( params.id, event.blockHash)
            this.manualSettle(params.id, event.blockHash)
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
