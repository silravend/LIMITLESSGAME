<template>
    <div class="" id="app">
        <layout
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
            @bet="betSubmit"
        >
        </layout>
    </div>
</template>

<script>
import { getGasPrice, getBetParams, settleBet, getRecord, getMyRecord, getAmountParams } from "@/api/tron";
import getContract from "@/js/getContract";
import web3 from '@/js/web3'
import { sliceNumber } from '@/js/utils'
import Layout from './Layout.vue'

let contract

export default {
    name: "app",
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
            jackpotStart: 0,
            jackpotEnd: 0,
            minAmount: 0.01,
            maxAmount: 10.02,
            amountStep: 0.01,
            result: '',
            state:"bet",
            debug: true
        };
    },
    components: {
       Layout
    },

    watch: {
        amount () {
            this.fixAmount()
        }
    },

    async created() {
        this.getRecord()
        this.recordWs()
        this.getAmoutParams()
        
        // ethereum.enable().catch(reason => {
        //     console.log(reason);
        // }).then(accounts => {
        //     this.account = accounts[0]
        //     this.getBalance()
        //     this.getMyRecord()
        //     this.recordWs()
            
        //     contract = getContract(this.account)
            
        //     this.getJackpot()
        //     setInterval(() => {
        //         this.getJackpot()
        //     }, 10000)
        // })

        //获取油费
        const gasRes = await getGasPrice()
        this.gas = gasRes.gasPrice
    },

    async mounted () {
        console.log(window.tronWeb)
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
        this.getBalance()
        contract = await this.getContract()
        console.log(contract)
        
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
            const balance =  await tronWeb.trx.getBalance(this.account)
            this.balance = tronWeb.fromSun(balance)
        },
        
        async getJackpot () {
            this.jackpotStart = this.jackpotEnd
            const res = await contract.methods.jackpotSize().call()

            this.jackpotEnd = sliceNumber(web3.utils.fromWei(res))
        },

        getContract () {
            const address = 'TRfAw3n1xeMLygzpwXSEdspD78WFrNkEPS'
            return tronWeb.contract().at(address)
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

        async settle (randomNumber,blockNumber) {
            this.state = 'wait'
            const res = await settleBet({
                randomNumber: randomNumber,
                blockNumber: blockNumber
            })
            if (res === null) {
                this.betLoading = false
                this.state = 'bet'
                return;
            }

            this.state = 'result'
            this.result = res.sha3Mod100

            if (res.wins > 0) {
                this.$success(this.$t('aq',{num: res.wins}), 3000)
                this.$refs['app'].celebrate()
            } else {
                this.$error(this.$t('ar'))
            }

            setTimeout(() => {
                this.getBalance()
                this.state = 'bet'
                this.betLoading = false
            }, 3500)
            
        },

        async betSubmit() {
            this.betLoading = true
            const params = await this.getBetParams()
            
            contract.Commit().watch(res => {
                console.log('watch')
                console.log(res)
            })

            const trx = await contract.placeBet(params.betMask, params.modulo, params.commitLastBlock, params.commit, params.r, params.s).send({
                feeLimit: 1000000000,
                callValue: tronWeb.toSun(this.amount),
                shouldPollResponse: true
            }).catch(err => {
                console.log(err)
            })

            console.log(trx)

            const fetchBlock = trx => {
                return new Promise(resolve => {
                    const timer = setInterval(async () => {
                        const res = await tronWeb.trx.getTransactionInfo(trx)
                        if (res.blockNumber) {
                            clearInterval(timer)
                            resolve(res.blockNumber)
                        }
                    }, 1000)
                })
            }

            const blockNumber = await fetchBlock(trx)
            // const block = await tronWeb.trx.getBlock(blockNumber)
            
            this.settle(params.id, blockNumber)
        },

        async getRecord () {
            const res =  await getRecord()
            if (res === null) return;

            res.forEach(item => {
                item._update = this.formatDate(item.updatedAt)
                item._wins = sliceNumber(item.wins)
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
                item._wins = sliceNumber(item.wins)
            })

            this.myRecordList = res
        },

        recordWs () {
            var ws = new WebSocket(process.env.VUE_APP_WS, 'echo-protocol');

            ws.onopen = evt => { 
                
                ws.send("Hello WebSockets!");
            }

            ws.onmessage = evt => {
                try{
                    const res = JSON.parse(evt.data)
                    res._update = this.formatDate(res.updatedAt)
                    res._wins = sliceNumber(res.wins)
                    this.recordList.unshift(res)
                    if (res.address == this.account) {
                        this.myRecordList.unshift(res)
                    }
                } catch (err) {
                    
                }
            }

            ws.onclose = evt => {
                
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
