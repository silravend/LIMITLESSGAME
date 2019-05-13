<template>
    <div id="app">
        <game
            ref="app"
            symbol="TRX"
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
            :jackpotStart="jackpotStart"
            :jackpotEnd="jackpotEnd"
            :state="state"
            :result="result"
            :decimal="1"
            :loading="loading"
            :horseList="horseList"
            @bet="betSubmit"
            @ended="betEnd"
            @addRecord="addRecord"
        >
        </game>
    </div>
</template>

<script>
import { getBetParams, settleBet, getRecord, getMyRecord, getAmountParams } from "@/api/horseracing_tron";
import { sliceNumber } from '@/js/utils'
import Game from './Game.vue'
import calcReward from '@/js/calcReward'
import { tron as getContract, tronSettle as getSettleContract } from '@/js/contract'
import { getVideoUrl } from '@/api/horseracing_tron'

let contract, settleContract

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
            jackpotStart: 0,
            jackpotEnd: 0,
            minAmount: 0.01,
            maxAmount: 10.02,
            amountStep: 0.01,
            result: {},
            state:"bet",
            loading: true,
            debug: false,
            amountCache: 0.01, 
            numCache: 95,
            horseList: [95, 75, 48, 38, 18, 10],
        };
    },
    components: {
       Game
    },

    watch: {
        amount () {
            this.fixAmount()
        },

        account () {
            this.getBalance()
        }
    },

    async created() {
        this.getRecord()
        this.getAmoutParams()
    },

    mounted () {
        setTimeout(async () => {
            
            if (typeof window.tronWeb === "undefined") {
                this.$refs['app'].showIntro()
                return;
            }

            if (!window.tronWeb.defaultAddress.base58) {
                this.$error(this.$t('ay'), 5000)
                return
            }

            //等待 troweb 链接完成
            await window.tronWeb.isConnected()

            this.account = window.tronWeb.defaultAddress.base58
            this.getMyRecord()
            
            contract = await getContract()
            settleContract = await getSettleContract()

            if (!contract || !settleContract) {
                return 
            }

            this.getJackpot()
            setInterval(() => {
                this.getJackpot()
            }, 10000)
        }, 1000)
    },

    methods: {
        isMainNet () {
            return window.tronWeb.eventServer.host.indexOf('api.trongrid.io') > -1
        },

        async getAmoutParams () {
            const res = await getAmountParams()
            if (res === null) return;
            
            this.amount = res.defaultAmount
            this.minAmount = res.defaultAmount
            this.maxAmount = res.maxAmount
            this.amountStep = res.step
        },

        async getBalance () {
            const balance =  await window.tronWeb.trx.getBalance(this.account)
            this.balance = sliceNumber(window.tronWeb.fromSun(balance), 2)
            this.loading = false
        },
        
        async getJackpot () {
            this.jackpotStart = this.jackpotEnd
            const res = await contract.methods.jackpotSize().call()

            this.jackpotEnd = sliceNumber(window.tronWeb.fromSun(res), 2)
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
            
            // 如果v的值为128，则重新请求
            while(params.v == 128) {
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
            const block = await window.tronWeb.trx.getBlock(parseInt(blockNumber))
            const blockHash = "0x" + block.blockID
            let result = await settleContract.getInfo(id, blockHash).call()
            
            const sha3Mod100 = parseInt(result[1].toString()) || 100
            const wins = sliceNumber(calcReward.tron(this.amountCache, this.numCache), 2)

            return { sha3Mod100, wins }
        },

        //获取赛马的视频地址
        async getVideo ({wins, sha3Mod100}) {
            let winner = this.mapResultHorse({betMask: this.numCache, wins: wins, sha3Mod100: sha3Mod100})
            let video = await getVideoUrl({winner: winner})
            return video
        },

        // 手动提前计算
        async manualSettle (id, blockHash) {
            const { sha3Mod100, wins } = await this.getResult(id, blockHash)

            let result = {
                sha3Mod100: sha3Mod100,
                wins: sha3Mod100 < this.numCache ? wins : 0
            }
            
            const video = await this.getVideo(result)
            result.video = video

            this.result = result
            this.state = 'result'
        },

        submitVerify () {
            if (!this.isMainNet() && !this.debug) {
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
            
            contract.Commit().watch({filters: {commit: params.commit.slice(2)}}, (err, res) => {
                if(err) {
                    console.log(err)
                    this.$error(this.$t('av'))
                    this.betEnd()
                    return
                }
                this.settle(params.id, res.block)
                this.manualSettle(params.id, res.block)
            })

            contract.placeBet(params.betMask, params.modulo, params.commitLastBlock, params.commit, params.r, params.s).send({
                feeLimit: 100000000,
                callValue: window.tronWeb.toSun(this.amount),
                shouldPollResponse:true
            }).catch(err => {
                console.log(err)
                this.$error(this.$t('av'))
                this.betEnd()
            })
        },

        //根据数字匹配投注的马的编号
        mapBetHorse (num) {
            return this.horseList.indexOf(parseInt(num)) + 1
        },

        // 根据结果匹配到马的编号
        mapResultHorse (item) {
            const betNum = this.mapBetHorse(item.betMask)
            const result = parseInt(item.sha3Mod100)

            //如果中奖，则直接返回投注的🐎
            if(item.wins > 0) return betNum;

            for(let [i, item] of this.horseList.entries()) {
                //如果大于或等于第一匹马
                if (i == 0 && result >= item) return betNum == 1 ? 2 : 1;

                //小于当前且 >=后面; 则返回当前；另外循环不可能走到最后一位，因为那样的话，用户必然中奖
                if (result < item && result >= this.horseList[i + 1]) return i + 1;
            }
        },

        prefixRecord (item) {
            item._update = this.formatDate(item.updatedAt)
            item._wins = sliceNumber(item.wins, 2)
            item._link = `https://tronscan.org/#/transaction/${item.betTrx}`
            item._bet = this.mapBetHorse(item.betMask)
            item._result = item._result = `<div class="result-num">${this.mapResultHorse(item)}</div>`
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
        },

        formatDate(dateString) {
            let date = new Date(dateString)
            let s = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
            return s.replace(/(\b\d\b)/g, '0$1')
        }
    }
};
</script>

<style lang="scss">

</style>
