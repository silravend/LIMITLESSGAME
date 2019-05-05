<template>
    <div class="" id="app">
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
import { getGasPrice, getBetParams, settleBet, getRecord, getMyRecord, getAmountParams } from "@/api/tron";
import { sliceNumber } from '@/js/utils'
import Game from './Game.vue'
import calcReward from '@/js/calcReward'
import { tron as getContract, tronSettle as getSettleContract } from '@/js/contract'

let contract
let settleContract

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
            result: null,
            state:"bet",
            loading: true,
            debug: true,
            numCache: 95,
            amountCache: 0.01 
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

             if (!tronWeb.defaultAddress.base58) {
                this.$error(this.$t('ay'), 5000)
                return
            }

            //等待 troweb 链接完成
            await tronWeb.isConnected()

            this.account = tronWeb.defaultAddress.base58   
            
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
            return tronWeb.eventServer.host.indexOf('api.trongrid.io') > -1
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
            const balance =  await tronWeb.trx.getBalance(this.account)
            this.balance = sliceNumber(tronWeb.fromSun(balance), 0)
            this.loading = false
        },
        
        async getJackpot () {
            this.jackpotStart = this.jackpotEnd
            const res = await contract.methods.jackpotSize().call()

            this.jackpotEnd = sliceNumber(tronWeb.fromSun(res), 0)
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
                this.numCache = this.num
                this.amountCache = this.amount

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

        async settle (randomNumber,blockNumber) {
            this.state = 'wait'
            const res = await settleBet({
                randomNumber: randomNumber,
                blockNumber: blockNumber
            })
            // if (res === null) {
            //     this.betLoading = false
            //     this.state = 'bet'
            //     return;
            // }

            // this.state = 'result'
            // this.result = res  
        },

        betEnd () {
            this.getBalance()
            this.state = 'bet'
            this.betLoading = false
        },

        async getResult (id, blockNumber) {
            const block = await tronWeb.trx.getBlock(parseInt(blockNumber))
            const blockHash = "0x" + block.blockID
            let result = await settleContract.getInfo(id, blockHash).call()
            
            const sha3Mod100 = parseInt(result[1].toString()) || 100
            const wins = calcReward.tron(this.amountCache, this.numCache)
            console.log(sha3Mod100, wins)
            return { sha3Mod100, wins }
        },

        // 计算结果
        async manualSettle (id, blockNumber) {
            const { sha3Mod100, wins } = this.getResult(id, blockNumber)

            this.state = 'result'
            this.result = {
                sha3Mod100: sha3Mod100,
                wins: sha3Mod100 < this.numCache ? wins : 0
            }  
        },

        async betSubmit() {
            // 判定是否为主网
            if (!this.isMainNet() && !this.debug) {
                this.$error(this.$t('ax'))
                return
            }
            this.betLoading = true
            const params = await this.getBetParams()
            
            contract.Commit().watch((err, res) => {
                console.log('watch')
                console.log(err, res)
                
                if(err) {
                    this.$error(this.$t('av'))
                    this.state = 'bet'
                    this.betLoading = false
                    return
                }
                this.settle(params.id, res.block)
                this.manualSettle(params.id, res.block)
            })

            contract.placeBet(params.betMask, params.modulo, params.commitLastBlock, params.commit, params.r, params.s).send({
                feeLimit: 100000000,
                callValue: tronWeb.toSun(this.amount),
                shouldPollResponse:true
            }).catch(err => {
                console.log(err)
                this.$error(this.$t('av'))
                this.state = 'bet'
                this.betLoading = false
            })
            
            
            // const fetchBlock = trx => {
            //     console.log('fetchBlock')
            //     return new Promise(resolve => {
            //         const timer = setInterval(async () => {
            //             const res = await tronWeb.trx.getTransactionInfo(trx)
            //             if (res.blockNumber) {
            //                 clearInterval(timer)
            //                 resolve(res.blockNumber)
            //             }
            //         }, 1000)
            //     })
            // }

            // const blockNumber = await fetchBlock(trx)
            
            // this.settle(params.id, blockNumber)
        },

        async getRecord () {
            const res =  await getRecord()
            if (res === null) return;

            res.forEach(item => {
                item._update = this.formatDate(item.updatedAt)
                item._wins = sliceNumber(item.wins, 0)
                item._link = `https://tronscan.org/#/transaction/${item.betTrx}`
            })
            
            this.recordList = res
        },

        async getMyRecord () {
            const res =  await getMyRecord({
                address: this.account
            })
            if (res === null) return;
            res.forEach(item => {
                item._update = this.formatDate(item.updatedAt)
                item._wins = sliceNumber(item.wins, 0)
                item._link = `https://tronscan.org/#/transaction/${item.betTrx}`
            })

            this.myRecordList = res
        },

        recordWs () {
            var ws = new WebSocket(process.env.VUE_APP_WS, 'echo-protocol');

            ws.onmessage = evt => {
                try{
                    const res = JSON.parse(evt.data)
                    //Tron 地址以 T 字母开头
                    if (res.address.indexOf('T') == 0) {
                        res._update = this.formatDate(res.updatedAt)
                        res._wins = sliceNumber(res.wins, 0)
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
