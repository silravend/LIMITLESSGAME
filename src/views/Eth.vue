<template>
    <div class="" id="app">
        <layout
            ref="app"
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
import { getGasPrice, getBetParams, settleBet, getRecord, getMyRecord, getAmountParams } from "@/api";
import getContract from "@/js/getContract";
import web3 from '@/js/web3'
import { sliceNumber } from '@/js/utils'
import Layout from './Layout.vue'
import Modal from '@/components/Modal.vue'

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
       Layout,
       Modal
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
        
        //获取油费
        const gasRes = await getGasPrice()
        this.gas = gasRes.gasPrice
    },

    async mounted () {
        
        
        if (typeof window.ethereum === "undefined") {
            this.$refs['app'].showIntro()
            return;
        }
        const ethereum = window.ethereum
        
        if (ethereum.networkVersion != 1 && !this.debug ){
            this.$error(this.$t('ax'), 5000)
            return;
        }
        
        setTimeout(() => {
            if (!ethereum.selectedAddress) {
                this.$warn(this.$t('as'), 5000)
            }
        }, 1500)
        

        //获取账户余额
        const accounts = await ethereum.enable().catch(err => {
            if (err.code == 4001) {
                this.$warn(this.$t('au'))
            }
            return null
        })
        if (accounts === null) return;

        this.account = accounts[0]
        this.getBalance()
        this.getMyRecord()
        
        contract = getContract(this.account)
        
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
            })
        },
        
        async getJackpot () {
            this.jackpotStart = this.jackpotEnd
            const res = await contract.methods.jackpotSize().call()

            this.jackpotEnd = sliceNumber(web3.utils.fromWei(res))
        },

        fixAmount() {

            let num = parseFloat(this.amount);
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

        async settle (randomNumber,blockHash) {
             const res = await settleBet({
                randomNumber: randomNumber,
                hash: blockHash
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
            if (ethereum.networkVersion != 1 && !this.debug) {
                this.$error(this.$t('ax'), 5000)
                return
            }

            if (!ethereum.selectedAddress) {
                this.$warn(this.$t('as'))
                return;
            }

            if (this.amount > this.balance) {
                this.$warn(this.$t('at'))
                return;
            }

            this.betLoading = true
            const params = await this.getBetParams()
            
            contract.methods.placeBet(params.betMask, params.modulo, params.commitLastBlock, params.commit, params.r, params.s).send({
                from: this.account,
                gas: "300000",
                value: web3.utils.toWei(this.amount + '', "ether")
            }).catch( err => {
                console.log(err)
                if (err.message.indexOf('User denied') > -1) {
                    this.$error(this.$t('au'))
                } else {
                    this.$error(this.$t('av'))
                }

                this.betLoading = false
            })

            contract.once('Commit', {
            }, async (error, event) => {
                this.state = 'wait'    
                this.settle( params.id, event.blockHash)
            })
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

            ws.onopen = () => { 
                
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

            ws.onclose = () => {
                
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
