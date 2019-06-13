<template>
    <div class="" id="app">
        <game
            ref="app"
            symbol="EOS"
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
            :loading="loading"
            :celebrateVisible="celebrateVisible"
            :min="min"
            :max="max"
            :decimal="1"
            @bet="betSubmit"
            @ended="betEnd"
            @addRecord="addRecord"
        >
        </game>
    </div>
</template>

<script>
import { getBetParams, settleBet, getRecord, getMyRecord, getAmountParams, getHighRoller } from "@/api/dice_eos"
import { sliceNumber, foldString, tryDo } from '@/js/utils'
import Game from './Game.vue'
import { calcEosReward, calcLossPer } from '@/js/game'
import ScatterService from '@/js/eos/index'

const eos = new ScatterService()

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

        const account = await eos.login()
        if (account == -1) {
            this.$error(this.$t('bf'), 10000)
            return;
        }
        
        this.account = account.name
        await this.getBalance()
        this.loading = false

        this.getMyRecord()  
    },

    async mounted () {
        this.getJackpot()
        setInterval(() => {
            this.getJackpot()
        }, 10000)
        
    },

    methods: {
        async getBalance () {
            const [balance, err] = await tryDo(eos.getBalance())
            if (err) {
                console.log(err)
                return 
            }
            this.balance = balance
        },

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
            const res = await eos.getJackpot()
            
            this.jackpotEnd = res
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

        betEnd () {
            this.getBalance()
            this.state = 'bet'
            this.betLoading = false
        },

        async settle (randomNumber,blockNumber, transaction_id) {
            const { sha3Mod100 } = await settleBet({ randomNumber, blockNumber, transaction_id, beneficiary: this.account })
            const wins = sliceNumber(calcEosReward(this.amountCache, this.numCache))
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
            // if (window.ethereum.networkVersion != 1 && !this.debug) {
            //     this.$error(this.$t('ax'), 5000)
            //     return false
            // }

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
            const [res, err] = await tryDo(eos.bet(params, this.amount))
            if (err) {
                console.log(err)
                this.betEnd()
                return
            }
            
            this.settle(params.id, res.processed.block_num, res.transaction_id)
        },

        prefixRecord (item) {
            item._update = this.formatDate(item.updatedAt)
            item._wins = sliceNumber(item.wins)
            item._link = `https://bloks.io/transaction/${item.betTrx}`
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
