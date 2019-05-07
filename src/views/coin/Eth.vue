<template>
    <div class="" id="app">
        <game
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
            :loading="loading"
            :celebrateVisible="celebrateVisible"
            @bet="betSubmit"
            @ended="betEnd"
            @addRecord="addRecord"
        >
        </game>
    </div>
</template>

<script>
import { getGasPrice, getBetParams, settleBet, getRecord, getMyRecord, getAmountParams } from "@/api/flipcoin_eth"
import web3 from '@/js/web3'
import { sliceNumber } from '@/js/utils'
import Game from './Game.vue'
import calcReward from '@/js/calcReward'
import { eth as getContract, ethSettle as getSettleContract } from "@/js/contract"

let contract, settleContract

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
            jackpotStart: 0,
            jackpotEnd: 0,
            minAmount: 0.01,
            maxAmount: 10.02,
            amountStep: 0.01,
            result: {},
            state:"bet",
            loading: true,
            celebrateVisible: false,
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
        console.log(settleContract)
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
            let result = await settleContract.methods.getInfo(id, blockHash).call()
            
            console.log(result)

            const sha3Mod100 = parseInt(result[1].toString()) || 100
            const wins = sliceNumber(calcReward.eth(this.amountCache, this.numCache))
            console.log(sha3Mod100, wins)

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

        async getRecord () {
            const res =  await getRecord()
            if (res === null) return;

            res.forEach(item => {
                item._update = this.formatDate(item.updatedAt)
                item._wins = sliceNumber(item.wins)
                item._link = `https://etherscan.io/tx/${item.betTrx}`
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
                item._link = `https://etherscan.io/tx/${item.betTrx}`
            })

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
            let s = `${date.getHours()}:${date.getMinutes()}:${date.getMinutes()}`
            return s.replace(/(\b\d\b)/g, '0$1')
        }
    }
};
</script>

<style lang="scss">

</style>
