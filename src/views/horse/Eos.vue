<template>
    <div class="" id="app">
        <game
            ref="app"
            symbol="EOS"
            :account="account"
            :num.sync="num"
            :amount.sync="amount"
            :introVisible.sync="introVisible"
            :isNeedUpdate.sync="isNeedUpdate"
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
            :horseList="horseList"
            :min="min"
            :max="max"
            :decimal="1"
            @bet="betSubmit"
            @ended="betEnd"
            @addRecord="addRecord"
            @freeBet="freeBet"
        >
        </game>
    </div>
</template>

<script>
import { getGasPrice, getBetParams, settleBet, getRecord, getMyRecord, getAmountParams, getHighRoller, addGambler } from "@/api/horseracing_eos"
import { sliceNumber, foldString, tryDo } from '@/js/utils'
import Game from './Game.vue'
import {calcEosReward, calcLossPer} from '@/js/game'
import { getVideoUrl } from '@/api/horseracing_eth'

import EosService from '@/js/eos'

const eos = new EosService()

export default {
    data() {
        return {
            num: 95,
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
            min:1,
            max: 97,
            horseList: [95, 75, 48, 38, 18, 10],
            debug: true,
            introVisible: false,
            isNeedUpdate: false
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
            while(params.v == 128) {
                params = await ready()
            }

            return params
        },

        async settle (randomNumber,blockNumber, transaction_id, amount) {
            const { sha3Mod100 } = await settleBet({ randomNumber, blockNumber, transaction_id, beneficiary: this.account})
            const wins = sliceNumber(calcEosReward(amount || this.amountCache, this.numCache))
            let result = {
                sha3Mod100: sha3Mod100,
                wins: sha3Mod100 < this.numCache ? wins : 0
            }
            this.isNeedUpdate = true

            const video = await this.getVideo(result)
            result.video = video

            this.result = result
            this.state = 'result'
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

        betEnd () {
            this.getBalance()
            this.state = 'bet'
            this.betLoading = false
        },

        async freeBet () {
            this.betLoading = true

            const [[params, success], err] = await tryDo(Promise.all([this.getBetParams(), addGambler({address: this.account})]))
            if (err) {
                console.log(err)
                this.betEnd()
                return
            }
            
            const [res, betErr] = await tryDo(eos.freeBet(params))

             if (betErr) {
                console.log(err)
                this.betEnd()
                return
            }

            this.settle(params.id, res.processed.block_num, res.transaction_id, eos.freeAmount)
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

        //获取赛马的视频地址
        async getVideo ({wins, sha3Mod100}) {
            let winner = this.mapResultHorse({betMask: this.numCache, wins: wins, sha3Mod100: sha3Mod100})
            let video = await getVideoUrl({winner: winner})
            return video
        },
       
         //根据数字匹配投注的马的编号
        mapBetHorse (num) {
            return this.horseList.indexOf(parseInt(num)) + 1
        },

        // 根据结果匹配到马的编号
        mapResultHorse ({betMask, wins, sha3Mod100}) {
            const betNum = this.mapBetHorse(betMask)
            const result = parseInt(sha3Mod100)

            //如果中奖，则直接返回投注的🐎
            if(wins > 0) return betNum;

            for(let [i, item] of this.horseList.entries()) {
                //如果大于或等于第一匹马
                if (i == 0 && result >= item) return betNum == 1 ? 2 : 1;

                //小于当前且 >=后面; 则返回当前；另外循环不可能走到最后一位，因为那样的话，用户必然中奖
                if (result < item && result >= this.horseList[i + 1]) return i + 1;
            }
        },

        prefixRecord (item) {
            item._update = this.formatDate(item.updatedAt)
            item._wins = sliceNumber(item.wins)
            item._link = `https://bloks.io/transaction/${item.betTrx}`
            item._bet = this.mapBetHorse(item.betMask)
            item._result = item._result = `<div class="result-num">${this.mapResultHorse(item)}</div>`
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
            //如果是用户自己的投注，则延迟50s，等视频播放完成后再追加
            if (res.address == this.account) {
                setTimeout(() => {
                    this.prefixRecord(res)
                    this.recordList.unshift(res)
                    this.myRecordList.unshift(res)
                }, 50000)
            }else {
                this.prefixRecord(res)
                this.recordList.unshift(res)
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
