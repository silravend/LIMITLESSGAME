<template>
    <div id="app">
        <header>
            <img src="./assets/images/logo.png" alt="" class="logo">
            <nav>
                <a href="" class="nav-item"></a>
            </nav>
        </header>

        <main>
            <img src="./assets/images/main-bg.png" alt="" class="main-bg">
            <div class="main-ani">
                <div class="main-ani_item" v-for="i in aniLength" :class="{active: i == activeIndex || i == activeIndex2}" :key="i"></div>
            </div>
            <img src="./assets/images/main-wrapper.png" alt="" class="main-wrapper">
            <div class="main-mask"></div>

            <div class="main-balance">
                <img src="./assets/images/balance.png" class="main-balance_img" />
                <div class="main-balance_text">余额： {{balance}}</div>
            </div>

            <div class="main-dashboard">
                <div class="dashboard-item">
                    <div class="dashboard-item_hd">{{num}}</div>
                    <div class="dashboard-item_ft">小于此数获胜</div>
                </div>
                <div class="dashboard-item">
                    <div class="dashboard-item_hd">{{lossPer}}
                        <small>x</small>
                    </div>
                    <div class="dashboard-item_ft">赔率</div>
                </div>
                <div class="dashboard-item">
                    <div class="dashboard-item_hd">{{num}}%</div>
                    <div class="dashboard-item_ft">中奖概率</div>
                </div>
                <div class="dashboard-item">
                    <div class="dashboard-item_hd">{{bonus}}</div>
                    <div class="dashboard-item_ft">获胜金额</div>
                    <div class="dashboard-item_desc">ETH</div>
                </div>
            </div>

            <div class="main-slider">
                <div class="main-slider_hd">1</div>
                <div class="main-slider_bd">
                    <img src="./assets/images/slider.png" alt="" class="main-slider_bg">
                    <div class="main-slider_wrapper">
                        <vue-slider :width="655" :dot-size="55" v-model="num" :tooltip="'always'" :min="min" :max="max">
                            <template v-slot:dot>
                                <img src="./assets/images/move.png" class="custom-dot" />
                            </template>
                            <template v-slot:tooltip="{ num }">
                                <div class="custom-tooltip">{{ num }}</div>
                            </template>
                            <template v-slot:tooltip="{ value, focus }">
                                <div :class="['custom-tooltip', { focus }]">{{ value }}</div>
                            </template>
                        </vue-slider>
                    </div>
                </div>
                <div class="main-slider_hd">100</div>
            </div>

            <div class="main-gas">
                建议的汽油价格(Gas Price): {{gas}} 
                <span class="main-gas_jackpot">
                    奖池： <b class="main-gas_primary">
                        <countTo :startVal='jackpotStart' :decimals="4" :endVal='jackpotEnd' :duration='1500'></countTo>
                    </b>
                    ETH
                </span>
            </div>

            <div class="main-btns">
                <img class="minus-btn" @click="decrease" src="./assets/images/reduce.png" alt="">
                <div class="amount-input">
                    <input class="amount-input_input" v-model="amount" @blur="fixAmount" type="number">
                    <img src="./assets/images/input.png" alt="" class="amount-input_img">
                </div>
                <img class="plus-btn" @click="increase" src="./assets/images/plus.png" alt="">

                <div class="multi-btn">
                    <div @click="half" class="multi-btn_item">1/2</div>
                    <div @click="double" class="multi-btn_item">2x</div>
                    <div @click="amount = '0.01'" class="multi-btn_item">MIN</div>
                    <div @click="amount = '10.20'" class="multi-btn_item">MAX</div>

                    <div style="display:none" class="multi-btn_active">1x</div>
                </div>

                <div @click="bet" class="bet-btn" :class="{active: betLoading}">
                    <span v-if="!betLoading">下注</span>
                    <beat-loader  :loading="betLoading" color="rgba(255, 255, 255, .5)"></beat-loader>
                </div>
            </div>
        </main>

        <div class="tab">
            <div class="tab-item" :class="{active: tabActive == 0}" @click="tabActive = 0">所有投注</div>
            <div class="tab-item" :class="{active: tabActive == 1}" @click="tabActive = 1">我的投注</div>
        </div>

        <section class="table">
            <div class="table-header">
                <div class="table-header_item">时间</div>
                <div class="table-header_item">用户</div>
                <div class="table-header_item">投注</div>
                <div class="table-header_item">预测数</div>
                <div class="table-header_item">结果</div>
                <div class="table-header_item">奖金</div>
                <div class="table-header_item">幸运号码</div>
                <div class="table-header_item">验证</div>
            </div>

            <div v-if="tabActive == 0" class="table-list">
                <div v-for="(item, index) in recordList" :key="index" class="table-cell" :class="{success: item._wins > 0}">
                    <div class="cell-item">{{item._update}}</div>
                    <div class="cell-item">{{item.address}}</div>
                    <div class="cell-item">{{item.betAmount}}</div>
                    <div class="cell-item">{{item.betMask}}</div>
                    <div class="cell-item">
                        <div class="result-num">{{item.sha3Mod100}}</div>
                    </div>
                    <div class="cell-item">
                        <span v-if="item._wins > 0">+ {{item._wins}} ETH</span>
                        <span v-else> - - </span>
                    </div>
                    <div class="cell-item">{{item.jackpot}}</div>
                    <div class="cell-item">查看</div>
                </div>
            </div>

            <div v-if="tabActive == 1" class="table-list">
                <div v-for="(item, index) in myRecordList" :key="index" class="table-cell" :class="{success: item._wins > 0}">
                    <div class="cell-item">{{item._update}}</div>
                    <div class="cell-item">{{item.address}}</div>
                    <div class="cell-item">{{item.betAmount}}</div>
                    <div class="cell-item">{{item.betMask}}</div>
                    <div class="cell-item">
                        <div class="result-num">{{item.sha3Mod100}}</div>
                    </div>
                    <div class="cell-item">
                        <span v-if="item._wins > 0">+ {{item._wins}} ETH</span>
                        <span v-else> -- </span>
                    </div>
                    <div class="cell-item">{{item.jackpot}}</div>
                    <div class="cell-item">查看</div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import VueSlider from "vue-slider-component"
import "vue-slider-component/theme/default.css"

import { getGasPrice, getParams, settleBet, getRecord, getMyRecord } from "@/api";
import getContract from "@/js/getContract";
import web3 from '@/js/web3'
import BeatLoader from 'vue-spinner/src/BeatLoader.vue'
import CountTo from 'vue-count-to'
import { sliceNumber } from '@/js/utils'

let contract

export default {
    name: "app",
    data() {
        return {
            aniLength: 43,
            aniPaused: false,
            activeIndex: -1,
            activeIndex2: -1,
            min: 1,
            max: 97,
            num: 50,
            balance: 0,
            amount: 0.01,
            power: 1,
            gas: "",
            betLoading: false,
            account: "",
            recordList: [],
            myRecordList: [],
            tabActive: 0,
            jackpotStart: 0,
            jackpotEnd: 0
        };
    },
    components: {
        VueSlider,
        BeatLoader,
        CountTo
    },
    computed: {
        lossPer() {
            return ((this.min + this.max) / this.num).toFixed(2);
        },
        bonus() {
            const res = this.lossPer * this.amount
            return sliceNumber(res)
        }
    },

    watch: {
        betLoading (newVal) {
            if (newVal) {
                this.startAni()
            } else {
                this.stopAni()
            }
        }
    },
    async created() {
        this.getRecord()
        
        if (typeof window.ethereum === "undefined") {
            console.log("请安装metamask");
            return;
        }
        const ethereum = window.ethereum
        
        //获取账户余额
        ethereum.enable().catch(reason => {
            console.log(reason);
        }).then(accounts => {
            this.account = accounts[0]
            this.getBalance()
            this.getMyRecord()
            this.recordWs()
            
            contract = getContract(this.account)
            
            this.getJackpot()
            setInterval(() => {
                this.getJackpot()
            }, 10000)
        })

        //获取油费
        const gasRes = await getGasPrice()
        this.gas = gasRes.gasPrice
    },

    methods: {
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

        decrease() {
            if (this.amount <= 0.01) return;
            const amount = parseFloat(this.amount).toFixed(2);
            const digits = (amount.toString().split(".")[1] || "").length;
            this.amount = (
                (amount * Math.pow(10, digits) - 1) /
                Math.pow(10, digits)
            ).toFixed(2);
        },

        increase() {
            if (this.amount >= 10.2) return;
            const amount = parseFloat(this.amount).toFixed(2);
            const digits = (amount.toString().split(".")[1] || "").length;
            this.amount = (
                (amount * Math.pow(10, digits) + 1) /
                Math.pow(10, digits)
            ).toFixed(2);
        },

        half () {
            this.amount /= 2
            this.fixAmount() 
        },

        double () {
            this.amount *= 2
            this.fixAmount()
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
                this.amount = num.toFixed(2);
            }
        },

        async startAni() {
            this.aniPaused = false
            const step1 = () => {
                const inter = Math.ceil(  (Math.random() * 10 + 2) * 1000 / this.aniLength )
                return new Promise((resolve) => {
                    let timer = setInterval(() => {
                        this.activeIndex += 1;
                        if (this.activeIndex >= this.aniLength || this.aniPaused) {
                            clearInterval(timer);
                            this.activeIndex = -1;
                            resolve();
                        }
                    }, inter);
                });
            };

            const step2 = () => {
                const inter = Math.ceil((Math.random() * 10 + 2) * 1000 / this.aniLength )
                return new Promise((resolve) => {
                    let timer = setInterval(() => {
                        this.activeIndex += 1;
                        if (this.activeIndex >= this.aniLength || this.aniPaused) {
                            clearInterval(timer);
                            this.activeIndex = -1;
                            resolve();
                        }
                    }, inter);
                });
            };

            const step3 = () => {
                const inter = Math.ceil((Math.random() * 10 + 2) * 1000 / this.aniLength )
                this.activeIndex = this.aniLength;

                return new Promise((resolve) => {
                    let timer = setInterval(() => {
                        this.activeIndex -= 1;

                        if (this.activeIndex == -1 || this.aniPaused) {
                            clearInterval(timer);

                            this.activeIndex = -1;
                            resolve();
                        }
                    }, inter);
                });
            };

            const step4 = () => {
                const inter = Math.ceil((Math.random() * 10 + 2) * 1000 / this.aniLength )
                this.activeIndex2 = this.aniLength;

                return new Promise((resolve) => {
                    let timer = setInterval(() => {
                        this.activeIndex += 1;
                        this.activeIndex2 -= 1;

                        if (this.activeIndex >= this.aniLength || this.aniPaused) {
                            clearInterval(timer);

                            this.activeIndex = -1;
                            this.activeIndex2 = -1;
                            resolve();
                        }
                    }, inter);
                });
            }

            const aniRandom = fn => {
                if (this.aniPaused) return;
                const time = (Math.random() * 5 + 1) * 1000
                return new Promise(resolve => {
                    setTimeout(async () => {
                        await fn()
                        resolve()
                    }, time)
                })
                
            }

            await step1();
            await aniRandom(step2)
            await aniRandom(step3)
            while(!this.aniPaused) {
                await aniRandom(step4)
            }
        },

        stopAni () {
            this.aniPaused = true
        },

        async getParams () {
            const ready = async () => {
                const res = await getParams({
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

        async bet() {
            if (this.betLoading) return;
            this.betLoading = true

            const params = await this.getParams()
            
            contract.methods.placeBet(params.betMask, params.modulo, params.commitLastBlock, params.commit, params.r, params.s).send({
                from: this.account,
                gas: "300000",
                value: web3.utils.toWei(this.amount + '', "ether")
            }).catch(err => {
                if (err.message.indexOf('-32603') > -1) {
                    this.$error('用户拒绝了Metamask')
                }
                this.betLoading = false
            })

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
                    this.$success(`恭喜您赢得 ${res.wins} ETH`)
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
    background: #0e002d url(./assets/images/bg.jpg) no-repeat;
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
        background: url(./assets/images/item.png) no-repeat;
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
        background: url(./assets/images/gas-slide.png) no-repeat;
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
        background: url(./assets/images/gas-slider-item.png) no-repeat;
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
        background: url(./assets/images/bet.png) no-repeat;
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
            background: url(./assets/images/bet_actived.png) no-repeat;
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
