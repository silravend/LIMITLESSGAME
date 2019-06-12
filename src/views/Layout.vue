<template>
    <div :class="[$i18n.locale]">
        <section class="side">
            <div @click="goByGame('dice')" class="side-item" :class="{active: game == 'dice'}">
                <img src="@/assets/images/icon_dice.png" alt="" class="side-item_img">
                <div class="side-item_name">{{$t('bb')}}</div>
            </div>
            <div @click="goByGame('horseracing')" class="side-item" :class="{active: game == 'horseracing'}">
                <img src="@/assets/images/icon_horse.png" alt="" class="side-item_img">
                <div class="side-item_name">{{$t('bc')}}</div>
            </div>
            <div class="side-item" :class="{active: game == 'flipcoin'}">
                <img src="@/assets/images/icon_coin.png" alt="" class="side-item_img">
                <div class="side-item_name">{{$t('bd')}}</div>
            </div>
            
            <div @click="dividendsVisible = true" class="side-item">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-paimai"></use>
                </svg>
                <div class="side-item_name">{{$t('bg')}}</div>
            </div>
             <div @click="boxVisible = true" class="side-item">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-baoxiang"></use>
                </svg>
                <div class="side-item_name">{{$t('bq')}}</div>
            </div>
        </section>

        <header>
            <img src="../assets/images/logo.png" alt="" class="logo">
            <nav>
                <a @click="goBySymbol('ethereum')" class="nav-item" :class="{active: symbol == 'ETH'}">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-ethereum"></use>
                    </svg>
                    <span class="icon-symbol">ETHEREUM</span>
                </a>
                <a @click="goBySymbol('tron')" class="nav-item" :class="{active: symbol == 'TRX'}">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-icon_TRX"></use>
                    </svg>
                    <span class="icon-symbol">TRON</span>
                </a>
                <a @click="goBySymbol('eos')" class="nav-item" :class="{active: symbol == 'EOS'}">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-EOS"></use>
                    </svg>
                    <span class="icon-symbol">EOS</span>
                </a>
                <div class="nav-primary"></div>
                <a @click="fairnessVisible = true" class="nav-item">{{$t('a')}}</a>
                <a @click="inviteVisible = true" class="nav-item">{{$t('b')}}</a>
                <a @click="$emit('update:introVisible', true)" class="nav-item">{{$t('c')}}</a>
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

        <section class="slider">
            <div class="slider-contain">
                <div v-for="item in adRecordList" :key="item.id" class="slider-item" v-html="$t('ba',{addr: item._shortcutAddr, wins: item.wins, symbol: symbol, lossPer: item._lossPer})">
                </div>
                <div v-for="item in adRecordList" :key="item.commit" class="slider-item" v-html="$t('ba',{addr: item._shortcutAddr, wins: item.wins, symbol: symbol, lossPer: item._lossPer})">
                </div>
            </div>
        </section>

        <main>
            <div class="common-cover">
                <img :src="`https://limitless.ink/main-wrapper-${fullSymbol}1.png`" alt="" class="main-wrapper">
                 <div class="main-balance">
                    <img src="../assets/images/balance.png" class="main-balance_img" />
                    <div class="main-balance_text">
                        <beat-loader v-if="loading" :loading="loading" color="rgba(255, 255, 255, 1)"></beat-loader>
                        <span v-else>{{$t('d')}}： {{balance}}</span>
                    </div>
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

                    <div @click="bet" class="bet-btn" :class="{active: loading || betLoading}">
                        <beat-loader v-if="loading || betLoading" :loading="loading || betLoading" color="rgba(255, 255, 255, .5)"></beat-loader>
                        <span v-else>{{$t('e')}}</span>
                    </div>
                </div>
            </div>

            <div class="bg-cover">
                <slot name="bg-cover"></slot>
            </div>

            <div class="bet-cover">
                <slot name="bet-cover"></slot>
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
                <transition-group name="list" tag="div">
                    <div v-for="(item, index) in recordList" :key="index" class="table-cell" :class="{success: item._wins > 0}">
                        <div class="cell-item">{{item._update}}</div>
                        <div class="cell-item">{{item.address}}</div>
                        <div class="cell-item">{{item.betAmount}}</div>
                        <div class="cell-item" v-html="item._bet"></div>
                        <div class="cell-item" v-html="item._result"></div>
                        <div class="cell-item">
                            <span v-if="item._wins > 0">+ {{item._wins}} {{symbol}}</span>
                            <span v-else> - - </span>
                        </div>
                        <div class="cell-item">{{item.jackpot}}</div>
                        <div class="cell-item">
                            <a class="cell-item_link" :href="item._link" target="_blank">{{$t('w')}}</a>
                        </div>
                    </div>
                </transition-group>
            </div>

            <div v-if="tabActive == 1" class="table-list">
                <transition-group name="list" tag="div">
                    <div v-for="item in myRecordList" :key="item.id" class="table-cell" :class="{success: item._wins > 0}">
                        <div class="cell-item">{{item._update}}</div>
                        <div class="cell-item">{{item.address}}</div>
                        <div class="cell-item">{{item.betAmount}}</div>
                        <div class="cell-item" v-html="item._bet"></div>
                        <div class="cell-item" v-html="item._result"></div>
                        <div class="cell-item">
                            <span v-if="item._wins > 0">+ {{item._wins}} {{symbol}}</span>
                            <span v-else> - - </span>
                        </div>
                        <div class="cell-item">{{item.jackpot}}</div>
                        <div class="cell-item">
                            <a class="cell-item_link" :href="item._link" target="_blank">{{$t('w')}}</a>
                        </div>
                    </div>
                </transition-group>
            </div>
        </section>

        <section class="footer">
            <div class="footer-bg"><img src="https://limitless.ink/footer-bg.png" class="footer-bg_img"></div>
            
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

            <div class="footer-copyright">Copyright © 2019 limitless.vip | All rights reserved | frisbeegu@gmail.com</div>
        </section>

        <modal v-if="introVisible" :visible="introVisible" @update:visible="$emit('update:introVisible', false)" :title="$t('ac')" :btnText="$t('ad')">
            <div class="modal-text">
                <p>{{$t('ae')}}</p>
                <p>{{$t('af')}}</p>
                <p>Metamask ( Ethereum ):
                    <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn</a>
                </p>
                <p>TronLink ( Tron ):
                    <a href="https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec" target="_blank">https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec</a>
                </p>
                <p>Scatter ( Eos ):
                    <a href="https://get-scatter.com/" target="_blank">https://get-scatter.com/</a>
                </p>
                <p v-html="$t('ag')">
                    
                </p>
                <p>
                    <a href="https://api1.limitless.vip/download?url=plugins_and_tutorials.zip" target="_blank">https://api1.limitless.vip/download?url=plugins_and_tutorials.zip</a>
                </p>
            </div>
        </modal>

        <modal v-if="boxVisible" :visible.sync="boxVisible" :pretty="true" :title="$t('bq')" :btnText="$t('ad')">
            <div class="box-list">
                <div v-for="(item, index) in boxes" :key="index" @click="openBox(item)" class="box-item">
                    <div class="box-item_title">{{item.curr_state}} / {{item.cond_state}}</div>
                    <div class="box-item_img">
                        <img v-if="item.opened" :src="boxImgs[index].opened">
                        <img v-else :src="boxImgs[index].default">
                    </div>
                </div>
            </div>
        </modal>

        <modal v-if="dividendsVisible" :visible.sync="dividendsVisible" title="LIMITLESS TOKEN" :btnText="$t('ad')">
            <div class="dividends-modal">
                <div>{{$t('bh')}}</div>
                <div> 0 / 500000000</div>
                <div class="modal-main">
                    <div class="main-title">{{$t('bi')}}</div>
                    <div class="main-symbol">0 TRX</div>
                    <div class="main-desc">
                        {{$t('bj')}} <br>({{$t('bk')}}: 0) TRX
                    </div>
                    <Btn :height="30">{{$t('bl')}}</Btn>
                </div>

                <div class="modal-actions">
                    <div class="actions-item">
                        <div class="actions-item_title">{{$t('bm')}}</div>
                        <input placeholder="0 LT" class="actions-item_input" type="text">
                        <Btn :height="30">{{$t('bn')}}</Btn>
                    </div>
                    <div class="actions-item">
                        <div class="actions-item_title">{{$t('bl')}}</div>
                        <input placeholder="0 LT" class="actions-item_input" type="text">
                        <Btn :height="30">{{$t('bo')}}</Btn>
                    </div>
                    <div class="actions-item">
                        <div class="actions-item_title">{{$t('bp')}}</div>
                        <input placeholder="0 LT" class="actions-item_input" type="text">
                        <Btn :height="30">{{$t('bl')}}</Btn>
                    </div>
                </div>
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
                {{$t('al')}}https://www.limitless.vip/game?invite=
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
import BeatLoader from "vue-spinner/src/BeatLoader.vue"
import Confetti from "canvas-confetti"
import Modal from "@/components/Modal.vue"
import Btn from '@/components/Btn.vue'
import { foldString } from '@/js/utils'
import { getTreasureBox, openTreasureBox } from '@/api/common'

export default {
    name: "layout",
    inheritAttrs: false,
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

            boxes: [],
            boxImgs: [
                {default: require('../assets/images/box1.png'), opened: require('../assets/images/box1_active.png')},
                {default: require('../assets/images/box2.png'), opened: require('../assets/images/box2_active.png')},
                {default: require('../assets/images/box3.png'), opened: require('../assets/images/box3_active.png')},
                {default: require('../assets/images/box4.png'), opened: require('../assets/images/box4_active.png')},
                {default: require('../assets/images/box5.png'), opened: require('../assets/images/box5_active.png')},
            ],

            tokenList: {
                ETH: 'ethereum',
                TRX: 'tron',
                EOS: 'eos'
            },
            
            aniPaused: false,
            activeIndex: -1,
            activeIndex2: -1,
            
            power: 1,
            tabActive: 0,

            fairnessVisible: false,
            inviteVisible: false,
            vipVisible: false,
            rechargeVisible: false,
            langVisible: false,
            boxVisible: false,
            dividendsVisible: false,

            lampActive: -1,
            lampTimer: null,
        };
    },

    props: {
        account: {
            default: ''
        },
        symbol: {
            default: "ETH"
        },
        loading: {
            default: false
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
        betLoading: {
            default: false
        },
        recordList: Array,
        myRecordList: Array,
        adRecordList: Array,
        celebrateVisible: {
            default: false
        },
        game: {
            default: ''
        },
        state: {
            default: 'bet'
        },
        introVisible: {
            default: false
        }
    },

    components: {
        BeatLoader,
        Modal,
        Btn
    },

    computed: {
        curLang () {
            return this.langList[this.$i18n.locale]
        },
        
        fullSymbol () {
            return this.tokenList[this.symbol]
        }
    },

    watch: {
        celebrateVisible (newVal) {
            if (newVal) {
                this.celebrate()
            }
        },
        state (newVal) {
            if (newVal == 'bet') {
                this.stopLampAni()
            } else {
                this.startLampAni()
            }
        },
        async account (newVal) {
            this.getTreasureBox()
        }
    },

    created () {
        this.recordWs()
    },

    mounted () {
        
    },

    methods: {

        async openBox (item) {
            const res = await openTreasureBox({address: this.account, boxid: item.id})
            if (res !== null ){
                this.$success(res.message[this.$i18n.locale], 3000)
                item.opened = 1
            }
        },

        async getTreasureBox () {
            const res = await getTreasureBox(this.account)
            this.boxes = res.treasure_boxes
        },

        goByGame (game) {
            location.href = `https://www.limitless.vip/${game}/${this.fullSymbol}`
        },

        goBySymbol (symbol) {
            location.href = `https://www.limitless.vip/${this.game}/${symbol}`
        },

        changeLang (lang) {
            this.$i18n.locale = lang
            localStorage.setItem('lang', lang)
            this.langVisible = false
        },
        startLampAni () {
            if (this.lampTimer) clearInterval(this.lampTimer);

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
            if (this.betLoading || this.loading) return;

            this.$emit("bet")
        },

        decrease() {
            if (this.amount <= this.minAmount) return;
            const amount = parseFloat(this.amount).toFixed(2)
            const digits = (amount.toString().split(".")[1] || "").length
            const result = (
                (amount * Math.pow(10, digits) -
                    this.amountStep * Math.pow(10, digits)) /
                Math.pow(10, digits)
            ).toFixed(2)

            this.$emit("update:amount", result)
        },

        increase() {
            if (this.amount >= this.maxAmount) return;
            const amount = parseFloat(this.amount).toFixed(2);
            const digits = (amount.toString().split(".")[1] || "").length;
            const result = (
                (amount * Math.pow(10, digits) +
                    this.amountStep * Math.pow(10, digits)) /
                Math.pow(10, digits)
            ).toFixed(2)

            this.$emit("update:amount", result)
        },

        half() {
            this.$emit("update:amount", this.amount / 2)
        },

        double() {
            this.$emit("update:amount", this.amount * 2)
        },

        setMin() {
            this.$emit("update:amount", this.minAmount)
        },

        setMax() {
            this.$emit("update:amount", this.balance)
        },

        // 中奖后的庆祝效果
        celebrate() {
            var end = Date.now() + 5 * 1000
            var interval = setInterval(() => {
                if (Date.now() > end) {
                    clearInterval(interval)
                    this.$emit('update:celebrateVisible', false)
                    return;
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
        },

        //根据地址判定币种
        mapSymbolByAddr (address) {
            if (address.indexOf('T') == 0) {
                return 'TRX'
            }
            if (address.indexOf('0x') == 0) {
                return 'ETH'
            }
            if (address.length == 12) {
                return 'EOS'
            }
        },

        //匹配出对应的游戏
        mapGame (v, modulo) {
            if (v == 27 && modulo == 100) {
                return 'dice'
            }
            if (v == 127 && modulo == 100) {
                return 'horseracing'
            }
            if (v == 27 && modulo == 2) {
                return 'flipcoin'
            }
        },

        //根据游戏匹配对应的翻译
        translateGame (game) {
            if (game == 'dice') return this.$t('bb');
            if (game == 'horseracing') return this.$t('bc');
        },

        //判断是否属于当前游戏的记录
        isCurRecord (res) {          
            let symbol = this.mapSymbolByAddr(res.address)
            let game = this.mapGame(res.v, res.modulo)

            if (this.symbol == symbol && this.game == game) return true;
        },

        recordWs () {
            var ws = new WebSocket(process.env.VUE_APP_WS, 'echo-protocol')

            ws.onmessage = evt => {
                try{
                    const res = JSON.parse(evt.data)
                    if (this.isCurRecord(res)) {
                        this.$emit('addRecord', res)
                    }
                    if (res.wins > 0) {
                        const game = this.mapGame(res.v, res.modulo)
                        const gameName = this.translateGame(game)
                        const text = this.$t('be')
                        const symbol = this.mapSymbolByAddr(res.address)

                        this.$notify({
                            text: `<div>${foldString(res.address)} ${gameName} ${text} <span class="notification-primary">${res.wins}</span> ${symbol}</div>`
                        })
                    }
                } catch (err) {
                    // this.$error(err.message)
                    console.log(err)
                }
            }
        },
    }
};
</script>

<style lang="scss">
@import "@/css/normalize.scss";
@import "@/css/layout.scss";
@import "@/css/animate/fade-in-top.scss";

body {
    background: #0e002d url(https://limitless.ink/bg.jpg) no-repeat;
    background-size: 100% auto;
}

.en{
    main{
        .dashboard-item_ft{
            font-size: 12px;
        }
    }
}

.list-enter-active{
    transition: all 1s;
}
.list-enter, .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
}


.slider{
    height: 50px;
    line-height: 50px;
    width: 1024px;
    margin: 70px auto 0;
    background: url(../assets/images/bg_adspace.png) no-repeat;
    background-size: 100% 100%; 
    overflow: hidden;
    white-space: nowrap;
    position: relative;

    .slider-contain{
        position: absolute;
        left: 0px;
        animation: slidein 20s linear  infinite normal
    }

    .slider-item{
        display: inline-block;
        vertical-align: middle;
        margin:0 20px;
        color: rgba(220, 124, 4, 1)
    }

    .slider-item_primary{
        color: #ffad39
    }

    .icon{
        color: #ffad39;
        margin-right: 5px;
    }
}

@keyframes slidein {
    from {
        transform: translateX(0)
    }
    to {
        transform: translateX(-50%)
    }
}


.side{
    position: fixed;
    z-index: 99;
    left: 0px;
    top: 50%;
    transform: translate(0, -50%);

    .side-item{
        width: 100px;
        height: 70px;
        background: linear-gradient(to right, rgba(255,173,57,1), rgba(108,13,185,1));
        background-size: 200%;
        background-position: 100% 0;
        border-radius:0px 10px 10px 0px;
        font-size: 12px;
        color: #fff;
        text-align: center;
        transition: all .6s;
        cursor: pointer;

        &.active{
            background-position: 0 0;
        }

        &:hover{
            background-position: 0 0;
        }

        &:not(:last-child){
            margin-bottom: 10px;
        }
    }

    .icon{
        color: #fff;
        font-size: 36px;
        margin-bottom: 5px;
        margin-top: 8px;
    }

    .side-item_img{
        width: 40px;
        height: 40px;
        margin-top: 8px;
    }
}

header {
    height: 70px;
    
    background: rgba(27, 20, 97, 1);
    opacity: 0.9;
    position: relative;
    z-index: 9;

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
    z-index: 9;
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
        z-index: 100;
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
    width: 1352px;
    margin: 0px auto 0;
    text-align: center;
    position: relative;
    height:765px;
    z-index:2;

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
        width: 660px;
        height: 382px;;
        left: 50%;
        right: 0px;
        top: 152px;
        transform: translate(-50%, 0);
        overflow: hidden;
    }
    .bet-cover{
        position: absolute;
        z-index: 10;
        width: 660px;
        height: 382px;
        left: 50%;
        right: 0px;
        top: 152px;
        transform: translate(-50%, 0);
        overflow: hidden;
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
        top: 300px;

        &.left {
            left: 295px;
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
            right: 299px;
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
        top: 73px;
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
        transform: translate(-50%, -2px);
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
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

    

   
    .main-btns {
        position: absolute;
        z-index: 10;
        bottom: 170px;
        display: flex;
        align-items: center;
        left: 373px;
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
        margin-left: 25px;
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
        margin-left: 40px;
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
    margin: -50px auto 50px;
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

.notification-primary{
    color: #ffad39
}

.box-list{
    display: flex;
    align-items: center;
    position: relative;
    

    

    .box-item{
        flex:1;
        text-align: center
    }

    .box-item_img{
        height: 96px;
        line-height: 96px;
        cursor: pointer;
    }

    img{
        width: 110px;
        vertical-align: middle;
    }
}

.dividends-modal{
    text-align: center;

    .modal-main{
        border: 1px solid #734ead;
        border-radius: 4px;
        margin: 0px 0 30px 0;
        padding: 30px;
    }

    .main-title{
        font-size: 20px;
    }

    .main-symbol{
        color: #0c4ede;
        font-size: 24px;
        margin: 10px 0;
    }

    .main-desc{
        font-size: 14px;
        margin-bottom: 20px;
    }

    .modal-actions{
        display: flex;
        align-items: center;
    }

    .actions-item{
        flex: 1;
    }

    .actions-item_input{
        text-align: center;
        width: 140px;
        height: 30px;
        line-height: 30px;
        border: none;
        margin-bottom: 10px;
    }
}
</style>
