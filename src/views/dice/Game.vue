<template>
    <layout
        v-bind="$attrs"
        v-on="$listeners"
        :celebrateVisible.sync="celebrateVisible"
        game="dice"
    >
        <template v-slot:bg-cover>
            <div class="bg-cover-wrapper" :class="{result: $attrs.state != 'bet'}">
                <div class="bg-cover_item">
                    <div class="bg-cover_result">
                        
                    </div> 
                </div>

                <div class="bg-cover_item">
                    <img src="../../assets/images/main-bg.png" alt="" class="main-bg">
                    <div class="main-ani">
                        <div class="main-ani_item" v-for="i in aniLength" :class="{active: i == activeIndex || i == activeIndex2}" :key="i"></div>
                    </div>
                    <div class="main-mask"></div>
                </div>
            </div>
        </template>

        <template v-slot:bet-cover>
            <div class="bet-cover-wrapper" :class="{result: $attrs.state != 'bet'}">
                <div class="bet-cover_item">
                    <div class="result-num">
                        <TwinkleNumber :start="$attrs.state == 'wait'" :val="result.sha3Mod100" />
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
                            <div class="dashboard-item_desc">{{$attrs.symbol}}</div>
                        </div>
                    </div>

                    <div class="main-slider">
                        <div class="main-slider_hd">1</div>
                        <div class="main-slider_bd">
                            <img src="../../assets/images/slider.png" alt="" class="main-slider_bg">
                            <div class="main-slider_wrapper">
                                <vue-slider :width="426" :dot-size="36" @change="$emit('update:num', $event)" :value="num" :tooltip="'always'" :min="min" :max="max">
                                    <template v-slot:dot>
                                        <img src="../../assets/images/move.png" class="custom-dot" />
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
                                <countTo :startVal='jackpotStart' :decimals="decimal" :endVal='jackpotEnd' :duration='1500'></countTo>
                            </b>
                            {{$attrs.symbol}}
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </layout>
</template>

<script>
import Layout from '../Layout.vue'
import TwinkleNumber from '@/components/TwinkleNumber.vue'
import { sliceNumber } from "@/js/utils"
import VueSlider from "vue-slider-component"
import "vue-slider-component/theme/default.css"
import CountTo from "vue-count-to"
import NP from 'number-precision'

NP.enableBoundaryChecking(false)

export default {
    data () {
        return {
            aniLength: 30,
            activeIndex: -1,
            activeIndex2: -1,
            celebrateVisible: false
        }
    },
    inheritAttrs: false,
    props: {
        num: {
            default: 50
        },
        result: Object,
        jackpotStart: {
            default: 0
        },
        jackpotEnd: {
            default: 0
        },
        decimal: { 
            default: 4
        },
        gas: {
            default: ""
        },
        min: {
            default:1
        },
        max: {
            default: 97
        }
    },
    components: {
        Layout,
        TwinkleNumber,
        VueSlider,
        CountTo
    },

    watch :{
        '$attrs.state' (newVal) {
            if (newVal == 'result') {
                if (this.result.wins > 0) {
                    this.$success(this.$t('aq',{num: this.result.wins, symbol: this.$attrs.symbol}), 3000)
                    this.celebrateVisible = true
                } else {
                    this.$error(this.$t('ar'))
                }

                setTimeout(() => {
                    this.$emit('ended')
                }, 2500)
            }
        }
    },

    created () {
        
    },

    computed: {
        lossPer() {
            const step1 = NP.plus(this.min, this.max)
            const step2 = NP.divide(step1, this.num)
            
            return NP.round(step2, 2)
        },
        bonus() {
            const res = NP.times(this.lossPer, this.$attrs.amount)
            return sliceNumber(res);
        },
    },

    methods: {
        
    }
}
</script>

<style lang="scss">
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

    .bet-cover-wrapper{
        transform: translate(0, -50%);
        transition: all .3s;
        &.result{
            transform: translate(0, 0)
        }
    }

    .bet-cover_item{
        height: 382px;
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

    .main-dashboard {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 40px;
    }

    .dashboard-item {
        background: url(../../assets/images/item.png) no-repeat;
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
        bottom: 60px;
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
        cursor: pointer;
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
        bottom: 8px;
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

</style>

