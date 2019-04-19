<template>
    <div>
        <header>
            <img src="../assets/images/logo.png" alt="" class="logo">
            <nav>
                <a href="" class="nav-item" :class="{active: symbol == 'ETH'}">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-ethereum"></use>
                    </svg>
                    <span class="icon-symbol">ETHEREUM</span>
                    
                </a>
                <a style="display:none" href="" class="nav-item" :class="{active: symbol == 'TRX'}">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-icon_TRX"></use>
                    </svg>
                    <span class="icon-symbol">Tron</span>
                    
                   
                </a>
                <div class="nav-primary"></div>
                <a @click="fairnessVisible = true" class="nav-item">公平性</a>
                <a @click="inviteVisible = true" class="nav-item">邀请好友</a>
                
                <a @click="rechargeVisible = true" class="nav-item">充值</a>
            </nav>
        </header>

        <main>
            <div class="common-cover">
                <img src="../assets/images/main-wrapper.png" alt="" class="main-wrapper">
                 <div class="main-balance">
                    <img src="../assets/images/balance.png" class="main-balance_img" />
                    <div class="main-balance_text">余额： {{balance}}</div>
                </div>

                <div class="main-lamp left">
                    <div v-for="(item, index) in 3" :key="index" class="main-lamp_item" :class="{active: lampActive == index}"></div>
                </div>
                <div class="main-lamp right">
                    <div v-for="(item, index) in 3" :key="index" class="main-lamp_item" :class="{active: lampActive == index}"></div>
                </div>

                <div class="main-btns">
                    <img class="minus-btn" @click="decrease" src="../assets/images/reduce.png" alt="">
                    <div class="amount-input">
                        <input class="amount-input_input" @change="$emit('update:amount', $event.target.value)" :value="amount" type="number">
                        <img src="../assets/images/input.png" alt="" class="amount-input_img">
                    </div>
                    <img class="plus-btn" @click="increase" src="../assets/images/plus.png" alt="">

                    <div class="multi-btn">
                        <div @click="half" class="multi-btn_item">1/2</div>
                        <div @click="double" class="multi-btn_item">2x</div>
                        <div @click="setMin" class="multi-btn_item">MIN</div>
                        <div @click="setMax" class="multi-btn_item">MAX</div>

                        <div style="display:none" class="multi-btn_active">1x</div>
                    </div>

                    <div @click="bet" class="bet-btn" :class="{active: betLoading}">
                        <span v-if="!betLoading">下注</span>
                        <beat-loader :loading="betLoading" color="rgba(255, 255, 255, .5)"></beat-loader>
                    </div>
                </div>
            </div>

            <div class="bg-cover">
                <div class="bg-cover-wrapper" :class="{result: state != 'bet'}">
                    <div class="bg-cover_item">
                        <div class="bg-cover_result">
                            
                        </div> 
                    </div>

                    <div class="bg-cover_item">
                        <img src="../assets/images/main-bg.png" alt="" class="main-bg">
                        <div class="main-ani">
                            <div class="main-ani_item" v-for="i in aniLength" :class="{active: i == activeIndex || i == activeIndex2}" :key="i"></div>
                        </div>
                        <div class="main-mask"></div>
                    </div>

                    
                </div>
                    
            </div>

            <div class="bet-cover">
                <div class="bet-cover-wrapper" :class="{result: state != 'bet'}">
                    <div class="bet-cover_item">
                        <div class="result-num">
                            <TwinkleNumber :start="state == 'wait'" :val="result" />
                        </div>
                        
                    </div>

                    <div class="bet-cover_item">
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
                                <div class="dashboard-item_desc">{{symbol}}</div>
                            </div>
                        </div>

                        <div class="main-slider">
                            <div class="main-slider_hd">1</div>
                            <div class="main-slider_bd">
                                <img src="../assets/images/slider.png" alt="" class="main-slider_bg">
                                <div class="main-slider_wrapper">
                                    <vue-slider :width="655" :dot-size="55" @change="$emit('update:num', $event)" :value="num" :tooltip="'always'" :min="min" :max="max">
                                        <template v-slot:dot>
                                            <img src="../assets/images/move.png" class="custom-dot" />
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
                                奖池：
                                <b class="main-gas_primary">
                                    <countTo :startVal='jackpotStart' :decimals="4" :endVal='jackpotEnd' :duration='1500'></countTo>
                                </b>
                                {{symbol}}
                            </span>
                        </div>
                    </div>
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
                        <span v-if="item._wins > 0">+ {{item._wins}} {{symbol}}</span>
                        <span v-else> - - </span>
                    </div>
                    <div class="cell-item">{{item.jackpot}}</div>
                    <div class="cell-item">
                        <a class="cell-item_link" :href="'https://ropsten.etherscan.io/tx/' + item.betTrx" target="_blank">查看</a>
                    </div>
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
                        <span v-if="item._wins > 0">+ {{item._wins}} {{symbol}}</span>
                        <span v-else> -- </span>
                    </div>
                    <div class="cell-item">{{item.jackpot}}</div>
                    <div class="cell-item">
                        <a class="cell-item_link" :href="'https://ropsten.etherscan.io/tx/' + item.betTrx" target="_blank">查看</a>
                    </div>
                </div>
            </div>
        </section>

        <section class="footer">
            <div class="footer-bg"><img src="@/assets/images/footer-bg.png" class="footer-bg_img"></div>
            
            <div class="footer-desc">
                <div class="footer-desc_title">免责声明</div>
                <div>LIMITLESS目前不支持来自以下国家或地区的用户：中国大陆、美国（包括所有美国领土）。</div>
                <div>LIMITLESS禁止未满18岁的用户参与游戏。LIMITLESS是一款区块链游戏，包括一定程度的财务风险。玩家应该意识到这种风险并相应地进行自我管理。</div>
                <div>我们无意诱使任何人违反任何地方、州或国家的法律。玩家的唯一责任是参与自身管辖范围内的法律条款，以确定行为的合法性。</div>
                <div>如果您有任何的疑问，欢迎加入官方的电报群寻求帮助。</div>
            </div>
            
            <div class="footer-link">
                <a href="" class="link-item">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-facebook"></use>
                    </svg>
                </a>

                <a href="" class="link-item">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-telegram"></use>
                    </svg>
                </a>

                <a href="" class="link-item">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-medium"></use>
                    </svg>
                </a>

                <a href="" class="link-item">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-twitter"></use>
                    </svg>
                </a>
            </div>

            <div class="footer-copyright">Copyright © 2019 limitless.game | All rights reserved</div>
        </section>

        <modal v-if="introVisible" :visible.sync="introVisible" title="帮助说明" btnText="确定">
            <div class="modal-text">
                <p>请使用Chrome浏览器并安装插件钱包</p>
                <p>如果您还没有在Chrome浏览器上安装Metamask或者TronLink钱包，请点击以下链接进行下载（两款钱包均为Chrome浏览器上的免费插件）：</p>
                <p>Metamask:
                    <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn</a>
                </p>
                <p>TronLink:
                    <a href="https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec" target="_blank">https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec</a>
                </p>
                <p>
                    请自行注册并登录钱包，并切换至主网节点（非任何测试网络）。<br> 登录钱包后如果无法正常显示您的余额，请重新刷新页面再开始游戏。
                    <br> 如果您无法访问Google应用商店，可点击以下链接进行下载及观看安装教程。
                </p>
                <p>
                    <a href="https://api1.limitless.vip/download?url=plugins_and_tutorials.zip" target="_blank">https://api1.limitless.vip/download?url=plugins_and_tutorials.zip</a>
                </p>
            </div>
        </modal>

        <modal v-if="fairnessVisible" :visible.sync="fairnessVisible" title="公平性" btnText="确定">
            <div class="modal-text">
                <p>每局向玩家开放投注前，智能合约通过当前区块生成一个随机种子，该种子不由庄家、矿工或者任何人进行控制。此种子由拥有者签名后返还智能合约（可以通过浏览器进行查看）和玩家（可以在游戏内看到），方便之后验证对比。</p>
                <p>当游戏结束时，服务器会把原始种子进行展示，以此证明系统在整个游戏过程中并未控制或者修改种子，杜绝系统作弊的可能性。</p>
                <p>所有游戏的结果均可由对应的种子及签名来验证公平性。在极少特殊情况下，可能出现投注失败，此时系统会先从账户中扣除，然后在交易失败确认后再返回到您的钱包。</p>
            </div>
        </modal>

        <modal v-if="inviteVisible" :visible.sync="inviteVisible" title="邀请好友" btnText="确定">
            <div class="modal-text">
                最好玩的区块链游戏Limitless Game现已正式上线，投注即可获得代币LLT。通过质押LLT可以获得平台利润分红，越早加入，收益越大。机会多多，上不封顶https://limitless.vip/dice?invite=
            </div>
        </modal>

        <modal v-if="vipVisible" :visible.sync="vipVisible" title="VIP" btnText="确定">
            <div class="modal-text">
                <p>LIMITLESS平台上进行的任何游戏投注，都将收获额外奖金。VIP等级越高，奖金额度越高！</p>
                <p>注：VIP奖金根据ETH区块链上的不可逆交易进行计算。在极少特殊情况下，区块生产者可能丢弃您的交易（不会从您的账户扣款），该交易的VIP奖金将不会被计算。</p>
                <div>
                    <div>V1 累计投注 1,000 ETH 奖金0.01%</div>
                    <div>V2 累计投注 2,000 ETH 奖金0.02%</div>
                    <div>V3 累计投注 3,000 ETH 奖金0.03%</div>
                    <div>V4 累计投注 4,000 ETH 奖金0.04%</div>
                    <div>V5 累计投注 5,000 ETH 奖金0.05%</div>
                    <div>V6 累计投注 6,000 ETH 奖金0.06%</div>
                    <div>V7 累计投注 7,000 ETH 奖金0.07%</div>
                    <div>V8 累计投注 8,000 ETH 奖金0.08%</div>
                    <div>V9 累计投注 9,000 ETH 奖金0.09%</div>
                </div>
            </div>
        </modal>

        <modal v-if="rechargeVisible" :visible.sync="rechargeVisible" title="充值" btnText="确定">
            <div class="modal-text">
                <p>当用户钱包中的余额不足时，可以快捷的通过此入口在线充值，充值网站来自第三方支付平台，与Limitless没有合作关系，用户在进行充值时默认了解此风险。<br>
                    <a href="">已了解，去充值</a>
                </p>
            </div>
        </modal>
    </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

import BeatLoader from "vue-spinner/src/BeatLoader.vue";
import CountTo from "vue-count-to";
import { sliceNumber } from "@/js/utils";
import Confetti from "canvas-confetti";
import Modal from "@/components/Modal.vue";
import TwinkleNumber from '@/components/TwinkleNumber.vue'

let contract;

export default {
    name: "layout",
    data() {
        return {
            aniLength: 43,
            aniPaused: false,
            activeIndex: -1,
            activeIndex2: -1,
            min: 1,
            max: 97,
            power: 1,
            tabActive: 0,
            introVisible: false,
            fairnessVisible: false,
            inviteVisible: false,
            vipVisible: false,
            rechargeVisible: false,

            lampActive: -1,
            lampTimer: null,
        };
    },

    props: {
        symbol: {
            default: "ETH"
        },
        num: {
            default: 50
        },
        balance: {
            default: 0
        },
        amount: {
            default: 0.01
        },
        minAmount: {
            default: 0.01
        },
        maxAmount: {
            default: 10.02
        },
        amountStep: {
            default: 0.01
        },
        gas: {
            default: ""
        },
        betLoading: {
            default: false
        },
        recordList: Array,
        myRecordList: Array,
        jackpotStart: {
            default: 0
        },
        jackpotEnd: {
            default: 0
        },
        result: {
            default: ''
        },
        state: {
            default: '' // 'bet wait result' 
        }
    },

    components: {
        VueSlider,
        BeatLoader,
        CountTo,
        Modal,
        TwinkleNumber
    },
    computed: {
        lossPer() {
            return ((this.min + this.max) / this.num).toFixed(2);
        },
        bonus() {
            const res = this.lossPer * this.amount;
            return sliceNumber(res);
        }
    },

    watch: {
        betLoading(newVal) {
            // if (newVal) {
            //     this.startAni();
            // } else {
            //     this.stopAni();
            // }
        },
        lossPer() {
            return ((this.min + this.max) / this.num).toFixed(2);
        },
        bonus() {
            const res = this.lossPer * this.amount;
            return sliceNumber(res);
        },
        state (newVal) {
            if (newVal == 'wait') {
                this.startLampAni()
            } else {
                this.stopLampAni()
            }
        }
    },

    methods: {
        startLampAni () {
            this.lampTimer = setInterval(() => {
                if (this.lampActive >= 2) {
                    this.lampActive = -1
                }
                this.lampActive += 1
                
            }, 200)
        },

        stopLampAni () {
            clearInterval(this.lampTimer)
            this.lampActive = -1
        },

        bet() {
            if (this.betLoading) return;

            this.$emit("bet");
        },

        showIntro() {
            this.introVisible = true;
        },

        decrease() {
            if (this.amount <= this.minAmount) return;
            const amount = parseFloat(this.amount).toFixed(2);
            const digits = (amount.toString().split(".")[1] || "").length;
            const result = (
                (amount * Math.pow(10, digits) -
                    this.amountStep * Math.pow(10, digits)) /
                Math.pow(10, digits)
            ).toFixed(2);

            this.$emit("update:amount", result);
        },

        increase() {
            if (this.amount >= this.maxAmount) return;
            const amount = parseFloat(this.amount).toFixed(2);
            const digits = (amount.toString().split(".")[1] || "").length;
            const result = (
                (amount * Math.pow(10, digits) +
                    this.amountStep * Math.pow(10, digits)) /
                Math.pow(10, digits)
            ).toFixed(2);

            this.$emit("update:amount", result);
        },

        half() {
            this.$emit("update:amount", this.amount / 2);
        },

        double() {
            this.$emit("update:amount", this.amount * 2);
        },

        setMin() {
            this.$emit("update:amount", this.minAmount);
        },

        setMax() {
            this.$emit("update:amount", this.maxAmount);
        },

        async startAni() {
            this.aniPaused = false;
            const step1 = () => {
                const inter = Math.ceil(
                    (Math.random() * 10 + 2) * 1000 / this.aniLength
                );
                return new Promise(resolve => {
                    let timer = setInterval(() => {
                        this.activeIndex += 1;
                        if (
                            this.activeIndex >= this.aniLength ||
                            this.aniPaused
                        ) {
                            clearInterval(timer);
                            this.activeIndex = -1;
                            resolve();
                        }
                    }, inter);
                });
            };

            const step2 = () => {
                const inter = Math.ceil(
                    (Math.random() * 10 + 2) * 1000 / this.aniLength
                );
                return new Promise(resolve => {
                    let timer = setInterval(() => {
                        this.activeIndex += 1;
                        if (
                            this.activeIndex >= this.aniLength ||
                            this.aniPaused
                        ) {
                            clearInterval(timer);
                            this.activeIndex = -1;
                            resolve();
                        }
                    }, inter);
                });
            };

            const step3 = () => {
                const inter = Math.ceil(
                    (Math.random() * 10 + 2) * 1000 / this.aniLength
                );
                this.activeIndex = this.aniLength;

                return new Promise(resolve => {
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
                const inter = Math.ceil(
                    (Math.random() * 10 + 2) * 1000 / this.aniLength
                );
                this.activeIndex2 = this.aniLength;

                return new Promise(resolve => {
                    let timer = setInterval(() => {
                        this.activeIndex += 1;
                        this.activeIndex2 -= 1;

                        if (
                            this.activeIndex >= this.aniLength ||
                            this.aniPaused
                        ) {
                            clearInterval(timer);

                            this.activeIndex = -1;
                            this.activeIndex2 = -1;
                            resolve();
                        }
                    }, inter);
                });
            };

            const aniRandom = fn => {
                if (this.aniPaused) return;
                const time = (Math.random() * 5 + 1) * 1000;
                return new Promise(resolve => {
                    setTimeout(async () => {
                        await fn();
                        resolve();
                    }, time);
                });
            };

            await step1();
            await aniRandom(step2);
            await aniRandom(step3);
            while (!this.aniPaused) {
                await aniRandom(step4);
            }
        },

        stopAni() {
            this.aniPaused = true;
        },

        // 中奖后的庆祝效果
        celebrate() {
            var end = Date.now() + 5 * 1000;

            var interval = setInterval(function() {
                if (Date.now() > end) {
                    return clearInterval(interval);
                }

                Confetti({
                    startVelocity: 30,
                    spread: 360,
                    ticks: 60,
                    origin: {
                        x: Math.random(),
                        y: Math.random() - 0.2
                    }
                });
            }, 200);
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

    nav {
        display: flex;
        align-items: center;
        width: 1100px;
        margin: 0 auto;
        height: 100%;
    }

    .nav-item {
        font-size: 14px;
        color: #fff;
        margin-left: 30px;
        cursor: pointer;
        text-align: center;

        &.active{
            color: #ffad39
        }

        .icon{
            font-size: 20px;
            
            vertical-align: middle;
            margin-right: 5px;
        }

        .icon-symbol{
            vertical-align: middle
        }
    }

    .nav-primary {
        flex: 1;
    }
}

main {
    width: 1083px;
    margin: 150px auto 0;
    text-align: center;
    position: relative;
    height: 733px;
    

    .common-cover{
        position: absolute;
        z-index: 9;
        left: 0px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        
    }

    .bg-cover{
        position: absolute;
        z-index: 5;
        left: 0px;
        right: 0px;
        top: 55px;
        height: 600px;
        overflow: hidden;
    }

    

    .bg-cover-wrapper{
        transform: translate(0, -50%);
        transition: all .3s;
        &.result{
            transform: translate(0, 0)
        }
    }

    .bg-cover_item{
        height: 600px;
        position: relative;
    }

    .bg-cover_result{
        background: #0e002d;
        width: 1000px;
        height: 100%;
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0)
    }

    .bet-cover{
        position: absolute;
        z-index: 10;
        width: 824px;
        height: 550px;
        left: 50%;
        right: 0px;
        top: 58px;
        transform: translate(-50%, 0);
        overflow: hidden;
    }

    .bet-cover-wrapper{
        transform: translate(0, -50%);
        transition: all .3s;
        &.result{
            transform: translate(0, 0)
        }
    }

    .bet-cover_item{
        height: 550px;
        position: relative;
        &:before{
            content: '';
            display: table
        }

        .result-num{
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%)
        }
    }

    .main-ani {
        position: absolute;
        z-index: 2;
        width: 960px;
        top: 0px;
        left: 50%;
        transform: translate(-50%, 0);
    }

    .main-bg {
        position: absolute;
        z-index: 1;
        width: 963px;
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

    .main-lamp {
        position: absolute;
        z-index: 10;
        top: 270px;

        &.left {
            left: 7px;
            .main-lamp_item {
                background: url(../assets/images/lamp_l.png) no-repeat;
                background-size: 100% 100%;

                &.active{
                    background: url(../assets/images/lamp_l_active.png) no-repeat;
                    background-size: 100% 100%;
                }
            }
        }

        &.right {
            right: 11px;
            .main-lamp_item {
                background: url(../assets/images/lamp_r.png) no-repeat;
                background-size: 100% 100%;

                &.active{
                    background: url(../assets/images/lamp_r_active.png) no-repeat;
                    background-size: 100% 100%;
                }
            }
        }

        .main-lamp_item {
            width: 51px;
            height: 37px;
            margin-bottom: 9px;
        }
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
        top: 0px;
        left: 50%;
        transform: translate(-50%, 0);
        background: rgba(0, 0, 0, 0.3);
    }

    .main-dashboard {
        
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 80px;
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
        bottom: 90px;
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

    .vue-slider-dot {
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
        bottom: 15px;
        transform: translate(-50%, 0);
        font-size: 14px;
        color: rgba(255, 255, 255, 0.41);
        white-space: nowrap;
    }

    .main-gas_jackpot {
        margin-left: 20px;
    }

    .main-gas_primary {
        color: rgba(255, 255, 255, 0.8);
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

        &:hover {
            background: #075778;
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

    .cell-item_link {
        color: #fff;
    }

    .cell-item_link:hover {
        text-decoration: underline;
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

.footer {
    background: rgba(9, 1, 34, 1);
    
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 400;
    text-align: center;
    position: relative;
    margin-top: 300px;
    padding-bottom: 30px;
    &:before {
        content: "";
        display: table;
    }

    .footer-bg {
        position: absolute;
        transform: translate(0, -100%);
        left: 0px;
        right: 0px;
        font-size: 0px;
        z-index: -1;
    }

    .footer-bg_img {
        width: 100%;
        vertical-align: middle;
    }

    .footer-link{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 30px;
        margin-bottom: 40px;
    }

    .link-item{
        background: #fff;
        font-size: 30px;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border-radius: 50%;

        &:not(:first-child){
            margin-left: 40px;
        }
    }

    .footer-desc {
        width: 1100px;
        text-align: center;
        margin: 20px auto 40px;
        line-height: 2;
    }

    .footer-desc_title {
        margin-bottom: 15px;
        font-size: 20px;
    }

    .footer-copyright{
        color: rgba(255, 255, 255, 0.5);
    }
}

.modal-text {
    p {
        margin-bottom: 30px;
    }

    a {
        text-decoration: underline;
        color: #00e812;
    }
}
</style>
