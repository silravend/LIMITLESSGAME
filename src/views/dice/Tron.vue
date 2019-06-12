<template>
    <div id="app">
        <game
            ref="app"
            symbol="TRX"
            :account="account"
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
            :decimal="1"
            :loading="loading"
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
import { getBetParams, settleBet, getRecord, getMyRecord, getAmountParams, getHighRoller } from "@/api/dice_tron"
import { sliceNumber, foldString, tryDo } from '@/js/utils'
import Game from './Game.vue'
import { calcTronReward, calcLossPer } from '@/js/game'

import TronService from '@/js/tron'
const tron = new TronService()

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
            debug: false,
            amountCache: 50, 
            numCache: 0.01,
            min: 1,
            max: 97,
            introVisible: false
        };
    },
    components: {
       Game
    },

    watch: {
        amount () {
            this.fixAmount()
        },
    },

    async created() {
        this.getRecord()
        this.getAmoutParams()
        this.getHighRoller()
    },

    mounted () {
        setTimeout(async () => {
            
            if (!tron.checkInstalled()) {
                this.introVisible = true
                return;
            }

            if (!tron.getAccount()) {
                this.$error(this.$t('ay'), 5000)
                return
            }

            //等待 troweb 链接完成
            await tron.isConnected()
            this.account = tron.getAccount()
            await this.getBalance()
            this.loading = false

            //初始化合约
            await tron.initContract()

            this.getMyRecord()
            this.getJackpot()
            setInterval(() => {
                this.getJackpot()
            }, 10000)
        }, 1000)
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
            const [balance, err] = await tryDo(tron.getBalance())
            if (err) {
                console.log(err)
                return 
            }
            this.balance = balance
        },
        
        async getJackpot () {
            this.jackpotStart = this.jackpotEnd

            this.jackpotEnd = await tron.getJackpot()
        },


        fixAmount() {
            let num = parseInt(this.amount);
            if (isNaN(num)) {
                this.amount = this.minAmount
            } else {
                if (num < this.minAmount) {
                    num = this.minAmount
                } else if (num > this.maxAmount) {
                    num = this.maxAmount
                }

                this.$nextTick(() => {
                    this.amount = num
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

        settle (randomNumber,blockNumber) {
            settleBet({
                randomNumber: randomNumber,
                blockNumber: blockNumber
            })
        },

        betEnd () {
            this.getBalance()
            this.state = 'bet'
            this.betLoading = false
        },

        async getResult (id, blockNumber) {
            const sha3Mod100 = await tron.getResult(id, blockNumber)
            const wins = sliceNumber(calcTronReward(this.amountCache, this.numCache), 2)

            return { sha3Mod100, wins }
        },

        // 手动提前计算
        async manualSettle (id, blockNumber) {
            const { sha3Mod100, wins } = await this.getResult(id, blockNumber)

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
            if (!tron.checkMainNet() && !this.debug) {
                this.$error(this.$t('ax'))
                return
            }

            if (!window.tronWeb.defaultAddress.base58) {
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

            const [res, err] = await tryDo(tron.bet(params, this.amount))
            if (err) {
                console.log(err)
                this.$error(this.$t('av'))
                this.betEnd()
                return
            }
            this.settle(params.id, res.block)
            this.manualSettle(params.id, res.block)
        },

        prefixRecord (item) {
            item._update = this.formatDate(item.updatedAt)
            item._wins = sliceNumber(item.wins, 2)
            item._link = `https://tronscan.org/#/transaction/${item.betTrx}`
            item._bet = item.betMask
            item._result = `<div class="result-num">${item.sha3Mod100}</div>`
        },

        async getRecord () {
            const res =  await getRecord()
            if (res === null) return;

            res.forEach(item => this.prefixRecord(item))
            this.recordList = res
        },

        async getMyRecord () {
            const res =  await getMyRecord({
                address: this.account
            })
            if (res === null) return;

            res.forEach(item => this.prefixRecord(item))
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
