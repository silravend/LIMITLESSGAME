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
            :decimal="0"
            :loading="loading"
            @bet="betSubmit"
            @ended="betEnd"
        >
        </game>
    </div>
</template>

<script>
import { getBetParams, settleBet, getRecord, getMyRecord, getAmountParams } from "@/api/tron";
import { sliceNumber } from '@/js/utils'
import Game from './Game.vue'
import calcReward from '@/js/calcReward'
import { tron as getContract, tronSettle as getSettleContract } from '@/js/contract'

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
            debug: true,
            amountCache: 50, 
            numCache: 0.01
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
        this.recordWs()
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
            console.log(sha3Mod100, wins)

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
                console.log('watch')
                console.log(err, res)
                if(err) {
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

        prefixRecord (item) {
            item._update = this.formatDate(item.updatedAt)
            item._wins = sliceNumber(item.wins, 2)
            item._link = `https://tronscan.org/#/transaction/${item.betTrx}`
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

        recordWs () {
            var ws = new WebSocket(process.env.VUE_APP_WS, 'echo-protocol');

            ws.onmessage = evt => {
                try{
                    const res = JSON.parse(evt.data)
                    //Tron 地址以 T 字母开头
                    if (res.address.indexOf('T') == 0) {
                        this.prefixRecord(res)
                        this.recordList.unshift(res)
                        if (res.address == this.account) {
                            this.myRecordList.unshift(res)
                        }
                    }
                    
                } catch (err) {
                    this.$error(err.message)
                    console.log(err)
                }
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
