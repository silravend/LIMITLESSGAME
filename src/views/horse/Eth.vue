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
            :jackpotStart="jackpotStart"
            :jackpotEnd="jackpotEnd"
            :state="state"
            :result="result"
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
import { getGasPrice, getBetParams, settleBet, getRecord, getMyRecord, getAmountParams } from "@/api/horseracing_eth"
import web3 from '@/js/web3'
import { sliceNumber } from '@/js/utils'
import Game from './Game.vue'
import calcReward from '@/js/calcReward'
import { eth as getContract, ethSettle as getSettleContract } from "@/js/contract"
import { getVideoUrl } from '@/api/horseracing_eth'

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
            horseList: [95, 75, 48, 38, 18, 10],
            debug: true
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
    },

    async mounted () {
        if (typeof window.ethereum === "undefined") {
            this.$refs['app'].showIntro()
            return;
        }
        
        setTimeout(() => {
            if (window.ethereum.networkVersion != 1 && !this.debug ){
                this.$error(this.$t('ax'), 5000)
                return;
            }
            if (!window.ethereum.selectedAddress) {
                this.$warn(this.$t('as'), 5000)
            }
        }, 1500)
        

        //获取账户余额
        const accounts = await window.ethereum.enable().catch(err => {
            if (err.code == 4001) {
                this.$warn(this.$t('au'))
            }
            return null
        })
        if (accounts === null) return;

        this.account = accounts[0]
        this.getBalance()
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

        getBalance () {
            web3.eth.getBalance(this.account).then(balance => {
                this.balance = sliceNumber(web3.utils.fromWei(balance, "ether"))
                this.loading = false
            })
        },
        
        async getJackpot () {
            this.jackpotStart = this.jackpotEnd
            const res = await contract.methods.jackpotSize().call()

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
            
            // 如果v的值为128，则重新请求
            while(params.v == 128) {
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
            const wins = sliceNumber(calcReward.eth(this.amountCache, this.numCache))

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
                console.log('commit')
                this.settle( params.id, event.blockHash)
                this.manualSettle(params.id, event.blockHash)
            })
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
            item._link = `https://etherscan.io/tx/${item.betTrx}`
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
        },

        formatDate(dateString) {
            let date = new Date(dateString)
            let s = `${date.getHours()}:${date.getMinutes()}:${date.getMinutes()}`
            return s.replace(/(\b\d\b)/g, '0$1')
        }
    }
};
</script>

<style lang="scss">

</style>
