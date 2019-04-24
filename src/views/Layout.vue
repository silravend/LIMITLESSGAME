<template>
    <div :class="[$i18n.locale]">
        <header>
            <img src="../assets/images/logo.png" alt="" class="logo">
            <nav>
                <a href="https://www.limitless.vip" class="nav-item" :class="{active: symbol == 'ETH'}">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-ethereum"></use>
                    </svg>
                    <span class="icon-symbol">ETHEREUM</span>
                </a>
                <a style="display:none" href="https://www.limitless.vip/dice/tron" class="nav-item" :class="{active: symbol == 'TRX'}">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-icon_TRX"></use>
                    </svg>
                    <span class="icon-symbol">Tron</span>
                </a>
                <div class="nav-primary"></div>
                <a @click="fairnessVisible = true" class="nav-item">{{$t('a')}}</a>
                <a @click="inviteVisible = true" class="nav-item">{{$t('b')}}</a>
                
                <a @click="introVisible = true" class="nav-item">{{$t('c')}}</a>

                <div @mouseenter="langVisible = true" @mouseleave="langVisible = false" class="lang">
                    <div class="lang-item lang-current">
                        <img :src="curLang.image" alt="" class="lang-img">
                        <span class="lang-name">{{curLang.label}}</span>
                    </div>
                    <transition name="fade-in-top">
                        <div v-if="langVisible" class="lang-menu">
                            <div v-for="(item, key) in langList" :key="key" @click="changeLang(key)" class="lang-item">
                                <img :src="item.image" alt="" class="lang-img">
                                <span class="lang-name">{{item.label}}</span>
                            </div>
                            
                        </div>
                    </transition>
                </div>
            </nav>
        </header>

        <main>
            <div class="common-cover">
                <img src="../assets/images/main-wrapper.png" alt="" class="main-wrapper">
                 <div class="main-balance">
                    <img src="../assets/images/balance.png" class="main-balance_img" />
                    <div class="main-balance_text">{{$t('d')}}： {{balance}}</div>
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
                        <span v-if="!betLoading">{{$t('e')}}</span>
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
                                <div class="dashboard-item_ft">{{$t('f')}}</div>
                            </div>
                            <div class="dashboard-item">
                                <div class="dashboard-item_hd">{{lossPer}}
                                    <small>x</small>
                                </div>
                                <div class="dashboard-item_ft">{{$t('g')}}</div>
                            </div>
                            <div class="dashboard-item">
                                <div class="dashboard-item_hd">{{num}}%</div>
                                <div class="dashboard-item_ft">{{$t('h')}}</div>
                            </div>
                            <div class="dashboard-item">
                                <div class="dashboard-item_hd">{{bonus}}</div>
                                <div class="dashboard-item_ft">{{$t('i')}}</div>
                                <div class="dashboard-item_desc">{{symbol}}</div>
                            </div>
                        </div>

                        <div class="main-slider">
                            <div class="main-slider_hd">1</div>
                            <div class="main-slider_bd">
                                <img src="../assets/images/slider.png" alt="" class="main-slider_bg">
                                <div class="main-slider_wrapper">
                                    <vue-slider :width="426" :dot-size="36" @change="$emit('update:num', $event)" :value="num" :tooltip="'always'" :min="min" :max="max">
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
                            <span v-if="gas">{{$t('j')}}(Gas Price): {{gas}}</span>
                            <span class="main-gas_jackpot">
                                {{$t('k')}}
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

        <div class="integration-notify">
            {{$t('l', {reward: '2.50'})}}
        </div>

        <div class="tab">
            <div class="tab-item" :class="{active: tabActive == 0}" @click="tabActive = 0">{{$t('m')}}</div>
            <div class="tab-item" :class="{active: tabActive == 1}" @click="tabActive = 1">{{$t('n')}}</div>
        </div>

        <section class="table">
            <div class="table-header">
                <div class="table-header_item">{{$t('o')}}</div>
                <div class="table-header_item">{{$t('p')}}</div>
                <div class="table-header_item">{{$t('q')}}</div>
                <div class="table-header_item">{{$t('r')}}</div>
                <div class="table-header_item">{{$t('s')}}</div>
                <div class="table-header_item">{{$t('t')}}</div>
                <div class="table-header_item">{{$t('u')}}</div>
                <div class="table-header_item">{{$t('v')}}</div>
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
                        <a class="cell-item_link" :href="item._link" target="_blank">{{$t('w')}}</a>
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
                        <a class="cell-item_link" :href="item._link" target="_blank">{{$t('w')}}</a>
                    </div>
                </div>
            </div>
        </section>

        <section class="footer">
            <div class="footer-bg"><img src="@/assets/images/footer-bg.png" class="footer-bg_img"></div>
            
            <div class="footer-desc">
                <div class="footer-desc_title">{{$t('x')}}</div>
                <div>{{$t('y')}}</div>
                <div>{{$t('z')}}</div>
                <div>{{$t('aa')}}</div>
                <div>{{$t('ab')}}</div>
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

            <div class="footer-copyright">Copyright © 2019 limitless.vip | All rights reserved</div>
        </section>

        <modal v-if="introVisible" :visible.sync="introVisible" :title="$t('ac')" :btnText="$t('ad')">
            <div class="modal-text">
                <p>{{$t('ae')}}</p>
                <p>{{$t('af')}}</p>
                <p>Metamask:
                    <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn</a>
                </p>
                <p>TronLink:
                    <a href="https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec" target="_blank">https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec</a>
                </p>
                <p v-html="$t('ag')">
                    
                </p>
                <p>
                    <a href="https://api1.limitless.vip/download?url=plugins_and_tutorials.zip" target="_blank">https://api1.limitless.vip/download?url=plugins_and_tutorials.zip</a>
                </p>
            </div>
        </modal>

        <modal v-if="fairnessVisible" :visible.sync="fairnessVisible" :title="$t('ah')" :btnText="$t('ad')">
            <div class="modal-text">
                <p>{{$t('ai')}}</p>
                <p>{{$t('aj')}}</p>
                <p>{{$t('ak')}}</p>
            </div>
        </modal>

        <modal v-if="inviteVisible" :visible.sync="inviteVisible" :title="$t('b')" :btnText="$t('ad')">
            <div class="modal-text">
                {{$t('al')}}https://limitless.vip/dice?invite=
            </div>
        </modal>

        <modal v-if="vipVisible" :visible.sync="vipVisible" title="VIP" :btnText="$t('ad')">
            <div class="modal-text">
                <p>{{$t('am')}}</p>
                <p>{{$t('an')}}</p>
                <div>
                    <div>V1 {{$t('ao', {num: '1,000', precent: '0.01'})}}</div>
                    <div>V2 {{$t('ao', {num: '2,000', precent: '0.02'})}}</div>
                    <div>V3 {{$t('ao', {num: '3,000', precent: '0.03'})}}</div>
                    <div>V4 {{$t('ao', {num: '4,000', precent: '0.04'})}}</div>
                    <div>V5 {{$t('ao', {num: '5,000', precent: '0.05'})}}</div>
                    <div>V6 {{$t('ao', {num: '6,000', precent: '0.06'})}}</div>
                    <div>V7 {{$t('ao', {num: '7,000', precent: '0.07'})}}</div>
                    <div>V8 {{$t('ao', {num: '8,000', precent: '0.08'})}}</div>
                    <div>V9 {{$t('ao', {num: '9,000', precent: '0.09'})}}</div>
                </div>
            </div>
        </modal>

        <modal v-if="rechargeVisible" :visible.sync="rechargeVisible" title="充值" :btnText="$t('ad')">
            <div class="modal-text">
                <p v-html="$t('ap')"></p>
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
            langList:{
                zh: {
                    label: '中文',
                    image: require('@/assets/ico/zh.png')
                },
                en: {
                    label: 'English',
                    image: require('@/assets/ico/en.png')
                },
                kr: {
                    label: '한국어',
                    image: require('@/assets/ico/kr.png')
                }
            },
            aniLength: 28,
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
            langVisible: false,

            lampActive: -1,
            lampTimer: null
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
        },
        curLang () {
            return this.langList[this.$i18n.locale]
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
        changeLang (lang) {
            this.$i18n.locale = lang
            localStorage.setItem('lang', lang)
            this.langVisible = false
        },
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
@import "@/css/animate/fade-in-top.scss";

body {
    background: #0e002d url(../assets/images/bg.jpg) no-repeat;
    background-size: 100% auto;
}

.en{
    main{
        .dashboard-item_ft{
            font-size: 12px;
        }
    }
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

.lang{
    margin-left: 30px;
    cursor: pointer;
    position: relative;
    height: 100%;
    font-size: 14px;
    color: #fff;

    
    .lang-name {
        vertical-align: middle;    
        margin-left: 10px;
    }
    
    .lang-img{
        width:25px;
        height:25px;
        vertical-align: middle
    }

    .lang-menu{
        position: absolute;
        z-index: 9;
        top: 70px;
    }

    .lang-item{
        width: 100px;
        height: 50px;
        line-height: 50px;
        background: #1b1461;
        padding-left: 20px;

        &:last-child{
            border-radius: 0 0 4px 4px;
        }
        &:hover{
            background: #0e0940;
        }

        &.lang-current{
            margin-top: 10px;
            &:hover{
                background: #1b1461;
            }
        }
    }

    
}

main {
    width: 1081px;
    margin: 50px auto 0;
    text-align: center;
    position: relative;
    height:571px;
    

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
        left: 220px;
        right: 220px;
        top: 118px;
        height: 370px;
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
        width: 640px;
        height: 370px;
        left: 50%;
        right: 0px;
        top: 115px;
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
        height: 370px;
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
        width: 100%;
    }

    .main-lamp {
        position: absolute;
        z-index: 10;
        top: 253px;

        &.left {
            left: 178px;
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
            right: 174px;
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
            width: 33px;
            height: 24px;
            margin-bottom: 9px;
        }
    }

    .main-balance {
        position: absolute;
        z-index: 10;
        left: 50%;
        top: 38px;
        transform: translate(-50%, 0);
    }

    .main-balance_img{
        width: 320px;
    }

    .main-balance_text {
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        transform: translate(-50%, 4px);
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 10px;
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
        margin-top: 32px;
    }

    .dashboard-item {
        background: url(../assets/images/item.png) no-repeat;
        background-size: 100% 100%;
        width: 132px;
        height: 190px;
        position: relative;

        &:not(:first-child) {
            margin-left: 23px;
        }
    }

    .dashboard-item_hd {
        height: 144px;
        line-height: 144px;
        font-size: 26px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
    }
    .dashboard-item_ft {
        height: 50px;
        line-height: 50px;
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
        bottom: 75px;
    }

    .main-slider {
        position: absolute;
        z-index: 10;
        bottom: 70px;
        left: 50%;
        transform: translate(-50%, 0);
        width: 560px;
        height: 29px;
        border-radius: 6px;
        background: #150221;
        display: flex;
        align-items: center;
    }
    .main-slider_bg{
        width: 463px;
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
        top: -14px;
        left: 18px;
    }

    .custom-dot{
        width: 34px;
        height: 36px;
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
        left: 253px;
    }

    .minus-btn {
        width: 42px;
        height: 42px;
        cursor: pointer;
    }

    .amount-input {
        position: relative;
        margin-left: 3px;
    }

    .amount-input_img{
        height: 42px;
    }

    .amount-input_input {
        position: absolute;
        z-index: 9;
        width: 100%;
        height: 42px;
        line-height: 42px;
        border: none;
        background: none;
        text-align: center;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        font-size: 16px;
    }

    .plus-btn {
        margin-left: 4px;
        width: 38px;
        height: 42px;
        cursor: pointer;
    }

    .multi-btn {
        background: url(../assets/images/gas-slide.png) no-repeat;
        background-size: 100% 100%;
        width: 194px;
        height: 44px;
        display: flex;
        align-items: center;
        padding: 0 4px;
        box-sizing: border-box;
        position: relative;
        margin-left: 20px;
    }

    .multi-btn_item {
        flex: 1;

        text-align: center;
        color: #fff;
        font-size: 14px;
        height: 28px;
        line-height: 28px;
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
        background-size: 100% 100%;
        width: 149px;
        height: 52px;
        line-height: 46px;
        text-align: center;
        letter-spacing: 2px;
        font-size: 28px;
        color: #fff;
        font-weight: 800;
        margin-left: 25px;
        cursor: pointer;

        &.active {
            background: url(../assets/images/bet_actived.png) no-repeat;
            background-size: 100% 100%;
        }
    }
}

.integration-notify{
    background: rgba(255, 255, 255, .1);
    text-align: center;
    height: 75px;
    line-height: 75px;
    border-radius: 75px;
    color: #ffad39;
    font-size: 24px;
    width: 400px;
    margin: 50px auto;
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
