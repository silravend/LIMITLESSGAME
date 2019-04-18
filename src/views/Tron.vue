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
            amountStep: 0.01
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
        this.getAmoutParams()
        
        console.log(window.tronWeb)

        if (typeof window.tronWeb === "undefined") {
            console.log("请安装TronWeb")
            return;
        }
        
        //等待 troweb 链接完成
        await tronWeb.isConnected()
        this.account = tronWeb.defaultAddress.base58   
        this.getBalance()
        contract = await this.getContract()
        console.log(contract)
        
        
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
            // const address = 'TFzqDkTGdzeJzpg2joyD1EoANqbHvR7VQm'
            const address = 'TVyxTRQ4CjZk3QfhpYMBJ4jtnffQYKA3zR'
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

        async betSubmit() {
            this.betLoading = true
            const params = await this.getBetParams()
            const trx = await contract.placeBet(params.betMask, params.modulo, params.commitLastBlock, params.commit, params.r, params.s).send({
                from: this.account,
                gas: this.gas,
                value: tronWeb.toSun(this.amount)
            })

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
            
            const res = await settleBet({
                randomNumber: params.id,
                blockNumber: blockNumber
            })
            
            if (res === null) {
                this.betLoading = false
                return;
            }

            if (res.wins > 0) {
                this.$refs['app'].celebrate()
                this.$success(`恭喜您赢得 ${res.wins} ETH`, 3000)
            } else {
                this.$success(`很遗憾没中奖，再接再厉~`)
            }
            this.betLoading = false
            

            // await tronWeb.trx.getBlockByNumber(blockNumber).then(data => {
            //     console.log(data.blockID)
            // })


            

            // watch((err, res) => {
            //     console.log(err, res)
            // }).catch( err => {
            //     if (err.indexOf('declined') > -1) {
            //         this.$error('交易被拒绝')
            //     }
            //     this.betLoading = false
            // })
            
            return
            contract.once('Commit', {
                
            }, async (error, event) => {
                const res = await settleBet({
                    randomNumber: params.id,
                    hash: event.blockHash
                })
                if (res === null) {
                    this.betLoading = false
                    return;
                }

                if (res.wins > 0) {
                    this.$refs['app'].celebrate()
                    this.$success(`恭喜您赢得 ${res.wins} ETH`, 3000)
                } else {
                    this.$success(`很遗憾没中奖，再接再厉~`)
                }
                this.betLoading = false
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
@import "@/css/normalize.scss";
@import "@/css/layout.scss";

body {
    background: #0e002d url(../assets/images/bg.jpg) no-repeat;
    background-size: 100% auto;
}

header {
    height: 70px;
    line-height: 70px;
    background: rgba(27, 20, 97, 1);
    opacity: 0.9;
    position: relative;

    .logo {
        position: absolute;
        z-index: 9;
        left: 50%;
        top: 0px;
        transform: translate(-50%, 0);
    }

    nav{
        display: flex;
        align-items: center;
        width: 1100px;
        margin: 0 auto;
    }

    .nav-item{
        font-size: 14px;
        color: #fff;
        margin-left: 30px;
    }

    .nav-primary{
        flex: 1
    }
}

main {
    width: 1083px;
    margin: 150px auto 0;
    text-align: center;
    position: relative;
    height: 733px;

    .main-ani {
        position: absolute;
        z-index: 2;
        width: 960px;
        top: 55px;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .main-bg {
        position: absolute;
        z-index: 1;
        width: 963px;
        top: 55px;
        left: 50%;
        margin-left: -483px;
    }

    .main-ani_item {
        height: 2px;
        background: rgba(97, 55, 218, 1);
        margin-bottom: 10px;

        &.active {
            box-shadow: 0 0 3px 2px rgba(255, 2552, 255, 0.6);
        }
    }

    .main-wrapper {
        position: absolute;
        z-index: 9;
        left: 0px;
        top: 0px;
    }

    .main-balance {
        position: absolute;
        z-index: 10;
        left: 50%;
        top: -60px;
        transform: translate(-50%, 0);
    }

    .main-balance_text {
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, 4px);
        font-size: 20px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
    }

    .main-mask {
        position: absolute;
        z-index: 5;
        width: 960px;
        height: 600px;
        top: 55px;
        left: 50%;
        transform: translate(-50%, 0);
        background: rgba(0, 0, 0, 0.3);
    }

    .main-dashboard {
        position: absolute;
        z-index: 10;
        display: flex;
        align-items: center;
        left: 50%;
        top: 138px;
        transform: translate(-50%, 0);
    }

    .dashboard-item {
        background: url(../assets/images/item.png) no-repeat;
        width: 162px;
        height: 233px;
        position: relative;

        &:not(:first-child) {
            margin-left: 23px;
        }
    }

    .dashboard-item_hd {
        height: 180px;
        line-height: 180px;
        font-size: 32px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
    }
    .dashboard-item_ft {
        height: 53px;
        line-height: 53px;
        font-size: 16px;
        color: rgba(128, 216, 255, 1);
    }

    .dashboard-item_desc {
        font-size: 24px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        opacity: 0.34;

        position: absolute;
        z-index: 3;
        left: 0px;
        right: 0px;
        text-align: center;
        bottom: 94px;
    }

    .main-slider {
        position: absolute;
        z-index: 10;
        bottom: 218px;
        left: 50%;
        transform: translate(-50%, 0);
        width: 824px;
        height: 44px;
        border-radius: 6px;
        background: #150221;
        display: flex;
        align-items: center;
    }
    .vue-slider-process {
        background: none;
        height: 24px;
        border-radius: 0px;
    }
    .vue-slider-rail {
        background: none;
        border-radius: 0px;
    }

    .vue-slider-dot{
        cursor: pointer;
    }

    .main-slider_wrapper {
        position: absolute;
        z-index: 9;
        top: -19px;
        left: 29px;
    }

    .custom-tooltip {
        transform: translateY(5px);
        font-weight: bold;
        color: #fff;
        font-size: 24px;
    }
    .main-slider_hd,
    .main-slider_ft {
        width: 56px;
        text-align: center;
        font-size: 16px;
        color: #80d8ff;
    }
    .main-slider_bd {
        flex: 1;
        position: relative;
    }

    .main-gas {
        position: absolute;
        z-index: 10;
        left: 50%;
        bottom: 140px;
        transform: translate(-50%, 0);
        font-size: 14px;
        color: rgba(255, 255, 255, .41);
    }

    .main-gas_jackpot{
        margin-left: 20px;
    }

    .main-gas_primary{
        color: rgba(255, 255, 255, .8);
        font-size: 16px;
    }

    .main-btns {
        position: absolute;
        z-index: 10;
        bottom: 30px;
        display: flex;
        align-items: center;
        left: 88px;
    }

    .minus-btn {
        width: 64px;
        height: 65px;
        cursor: pointer;
    }

    .amount-input {
        position: relative;
        margin-left: 3px;
    }

    .amount-input_input {
        position: absolute;
        z-index: 9;
        width: 100%;
        height: 63px;
        line-height: 63px;
        border: none;
        background: none;
        text-align: center;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        font-size: 16px;
    }

    .plus-btn {
        margin-left: 4px;
        cursor: pointer;
    }

    .multi-btn {
        background: url(../assets/images/gas-slide.png) no-repeat;
        width: 298px;
        height: 66px;
        display: flex;
        align-items: center;
        padding: 0 4px;
        box-sizing: border-box;
        position: relative;
        margin-left: 26px;
    }

    .multi-btn_item {
        flex: 1;
        
        text-align: center;
        color: #fff;
        font-size: 16px;
        height: 30px;
        line-height: 30px;
        border-radius: 6px;
        font-weight: 400;
        cursor: pointer;
        margin: 0 5px;

        &:hover{
            background: #075778
        }
    }

    .multi-btn_active {
        background: url(../assets/images/gas-slider-item.png) no-repeat;
        width: 72px;
        height: 70px;
        line-height: 70px;
        position: absolute;
        z-index: 2;

        text-align: center;
        color: rgba(255, 255, 255, 1);
        font-size: 24px;
        font-weight: bold;
    }

    .bet-btn {
        background: url(../assets/images/bet.png) no-repeat;
        width: 229px;
        height: 80px;
        line-height: 62px;
        text-align: center;
        letter-spacing: 2px;
        font-size: 35px;
        color: #fff;
        font-weight: 800;
        margin-left: 45px;
        cursor: pointer;

        &.active {
            background: url(../assets/images/bet_actived.png) no-repeat;
            background-size: 100% 100%;
        }
    }
}

.tab {
    display: flex;
    justify-content: center;
    margin-top: 70px;

    .tab-item {
        width: 120px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid rgba(142, 52, 215, 1);
        border-radius: 6px;
        font-size: 18px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);

        background: #6c0db9;
        cursor: pointer;

        &.active {
            background: #ffad39;
        }

        &:not(:first-child) {
            margin-left: 10px;
        }
    }
}

.table {
    width: 1030px;
    margin: 36px auto;
    background: rgba(62, 10, 82, 1);

    border-radius: 10px;
    padding: 0 35px 50px;

    .table-header {
        height: 68px;
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: 400;
        color: rgba(203, 173, 231, 1);
    }

    .table-header_item {
        flex: 1;
        text-align: center;
    }

    .table-cell {
        display: flex;
        align-items: center;
        height: 65px;
        background: rgba(234, 11, 11, 0.6);
        border-radius: 10px;
        font-size: 16px;
        color: #fff;
        font-weight: 500;
        text-align: center;
        margin-bottom: 10px;

        &:first-child {
            background: rgba(234, 11, 11, 0.8);
        }

        &.success {
            background: rgba(11, 234, 106, 0.6);
            &:first-child {
                background: rgba(11, 234, 106, 0.8);
            }
        }
    }
    .cell-item {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .cell-item_link{
        color: #fff;
    }

    .cell-item_link:hover{
        text-decoration: underline
    }

    .result-num {
        display: inline-block;
        width: 35px;
        height: 35px;
        line-height: 35px;
        border: 1px solid #fff;
        border-radius: 4px;
    }
}
</style>
