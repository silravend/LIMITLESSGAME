<template>
    <layout
        v-bind="$attrs"
        v-on="$listeners"
        :celebrateVisible.sync="celebrateVisible"
    >
        <template v-slot:bg-cover>
            <div class="bg-cover-wrapper" :class="{result: $attrs.state != 'bet'}">
                <div class="bg-cover_item">
                    <div class="bg-cover_result">
                        
                    </div> 
                </div>

                <div class="bg-cover_item">
                    <img src="../../assets/images/main-bg.png" alt="" class="main-bg">
                    
                    <div class="main-mask"></div>
                </div>
            </div>
        </template>

        <template v-slot:bet-cover>
            <div class="bet-cover-wrapper" :class="{result: $attrs.state == 'result'}">
                <div class="bet-cover_item">
                    <video class="horse-video" src="https://api1.limitless.vip/download?url=6.bf99b4d4.mp4"  playsinline="" webkit-playsinline="" x5-playsinline="" style="width: 100%; height: 100%;"></video>
                </div>

                <div class="bet-cover_item">
                    <ul class="horse-list">
                        <li v-for="(item, index) in horseList" :key="index" @click="$emit('update:num', item)" class="horse-item">
                            <img src="@/assets/images/horse1.png" alt="" class="item-img">
                        </li>
                    </ul>

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
import CountTo from "vue-count-to";

export default {
    data () {
        return {
            aniLength: 30,
            activeIndex: -1,
            activeIndex2: -1,
            min: 1,
            max: 97,
            horseList: [95, 75, 48, 38, 18, 10],
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
    },
    components: {
        Layout,
        TwinkleNumber,
        VueSlider,
        CountTo
    },

    created () {
        console.log(this.$listeners)
    },

    watch: {
        '$attrs.state' (newVal) {
            if (newVal == 'result') {
                this.$el.querySelector('.horse-video').play()
            }
        }
    },

    mounted () {
         this.$el.querySelector('.horse-video').addEventListener('ended', () => {
            if (this.result.wins > 0) {
                this.$success(this.$t('aq',{num: this.result.wins, symbol: 'TRX'}), 3000)
                this.celebrateVisible = true
            } else {
                this.$error(this.$t('ar'))
            }

            this.$emit('ended')
        }, false)
    },

    computed: {
        lossPer() {
            return ((this.min + this.max) / this.num).toFixed(2);
        },
        bonus() {
            const res = this.lossPer * this.$attrs.amount;
            return sliceNumber(res);
        },
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

    .horse-list{
        margin-left: -20px;
    }

    .horse-item{
        display: inline-block;
        width: 150px;
        margin: 20px ;
        cursor: pointer;
    }

    .item-img{
        max-width: 100%;
        
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

