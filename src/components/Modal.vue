<template>
    <div class="modal-comp">
        <transition name="modal" @after-leave="$emit('update:visible', false)">
            <div v-if="compVisile" class="comp-contain">
                <div v-if="closeVisible" @click="close" class="comp-close">
                    <img src="@/assets/images/modal-close.png" alt="" class="comp-close_img">
                </div>

                <div v-if="title" class="comp-title">{{title}}</div>

                <div class="comp-main">
                    <slot></slot>
                </div>

                <div @click="confirm" v-if="btnText" class="comp-btn">
                    {{btnText}}
                </div>
            </div>
        </transition>
        <x-mask v-if="compVisile" :visible.sync="compVisile"></x-mask>
    </div>
</template>

<script>
import XMask from './XMask.vue'

export default {
    data () {
        return {
            compVisile: false
        }
    },
    props: {
        title: String,
        btnText: String,
        closeVisible: Boolean,
        visible: {
            default: false
        }
    },
    components: {
        XMask
    },
    
    mounted () {
        this.compVisile = this.visible
    },

    methods: {
        close () {
            this.compVisile = false
        },

        confirm () {
            this.close()
            this.$emit('confirm')
        }
    }
}
</script>

<style lang="scss" scoped>
    .modal-comp{
        .comp-contain{
            position: fixed;
            z-index: 1000;
            top: 40%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
            width: 750px;
            background:rgba(31,2,91,1);
            border:3px solid rgba(115, 78, 173, 1);
            border-radius:12px;
            padding-bottom: 35px;
        }

        .comp-close{
            position: absolute;
            z-index: 9;
            right: 20px;
            top: 20px;
            font-size: 0px;
            cursor: pointer;
        }

        .comp-close_img{
            width: 31px;
            
        }

        .comp-title{
            font-size: 24px;
            color: #fff;
            text-align: center;
            font-weight: bold;
            margin-top: 40px;
        }

        .comp-main{
            font-size:16px;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height:26px;
            margin: 40px 50px 0;
        }

        .comp-btn{
            font-size:20px;
            font-weight:bold;
            color:rgba(128,216,255,1);
            line-height:26px;
            text-align: center;
            width: 144px;
            height: 48px;
            line-height: 48px;
            background: url(../assets/images/modal-btn.png) no-repeat;
            background-size: 100% 100%;
            margin: 60px auto 0px;
            cursor: pointer;
        }

        .modal-enter-active, .modal-leave-active {
            transition: all .5s;
            
        }
        .modal-enter, .modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
            opacity: 0;
            transform: translate3d(-50%, -60%, 0);
        }
    }
</style>

