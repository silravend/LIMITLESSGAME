<template>
    <layout
        v-bind="$attrs"
        v-on="$listeners"
        :celebrateVisible.sync="celebrateVisible"
        game="flipcoin"
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
                    <img src="@/assets/images/horse/horse1.png" alt="" class="animate-img">
                </div>

                <div class="bet-cover_item">
                    <img @click="$emit('update:num', 1)" src="@/assets/images/horse/horse1.png" alt="" class="item-img">
                    <img @click="$emit('update:num', 2)" src="@/assets/images/horse/horse2.png" alt="" class="item-img">
                </div>
            </div>
        </template>
    </layout>
</template>

<script>
import Layout from '../Layout.vue'
import { sliceNumber } from "@/js/utils"
import NP from 'number-precision'


export default {
    data () {
        return {
            aniLength: 29,
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
            default: 95
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
        }
    },
    components: {
        Layout
    },

    created () {
        console.log(this.$listeners)
    },

    watch: {
        '$attrs.state' (newVal) {
            if (newVal == 'wait') {
                setTimeout(() => {
                    if (this.result.wins > 0) {
                        this.$success(this.$t('aq',{num: this.result.wins, symbol: this.$attrs.symbol}), 3000)
                        this.celebrateVisible = true
                    } else {
                        this.$error(this.$t('ar'))
                    }

                    this.$emit('ended')
                }, 5000)
            }
        }
    },

    mounted () {
    },

    computed: {
        lossPer() {
            const step1 = NP.plus(this.min, this.max)
            const step2 = NP.divide(step1, this.num)
            return step2.toFixed(2)
        },
        bonus() {
            const res = NP.times(this.lossPer, this.$attrs.amount)
            return sliceNumber(res);
        },
    }
}
</script>

<style lang="scss">
    @keyframes coin{
        from {
            transform: rotate3d(0)
        }
        to {
            transform: rotate3d(0, 1, 0, 360deg)
        }
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
        transform-style:preserve-3d ;
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
        margin-top: 30px;
    }

    .horse-item{
        display: inline-block;
        width: 167px;
        height: 136px;
        margin-left: 20px ;
        margin-bottom: 20px ;
        cursor: pointer;
        background: url(../../assets/images/horse/bg.png) no-repeat;
        background-size: 100% 100%;
        overflow: hidden;

        &.active{
            background: url(../../assets/images/horse/bg_active.png) no-repeat;
            background-size: 100% 100%;
        }
    }

    .animate-img{
        animation:coin .3s ease-in 0s infinite running;
    }

    .item-img{
        max-width: 100%;
        margin-top: 10px;
    }

    .item-num{
        margin-top: 8px;
    }

    .item-num_img{
        vertical-align: middle
    }

    .item-num_name{
        vertical-align: middle;
        font-style:italic;
        font-size: 14px;
        color: #fff;
        margin-left: 10px;
    }

    .result-cell{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: #fff;
        font-weight: 400;
    }

    .result-cell_item{
        position: relative;
        &:not(:first-child){
            margin-left: 30px;
        }
    }

    .result-cell_line{
        width: 1px;
        height: 20px;
        background: rgba(255, 255, 255, .3);
        margin: 0 20px;
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
</style>

