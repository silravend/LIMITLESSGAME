<template>
    <div class="modal-comp">
        <transition name="modal" @after-leave="$emit('update:visible', false)">
            <div v-if="compVisile" class="comp-contain">
                <img v-if="pretty" src="../assets/images/alert_LT.png" alt="" class="comp-bg bg-lt">
                <img v-if="pretty" src="../assets/images/alert_RT.png" alt="" class="comp-bg bg-rt">
                <img v-if="pretty" src="../assets/images/alert_LB.png" alt="" class="comp-bg bg-lb">
                <img v-if="pretty" src="../assets/images/alert_RB.png" alt="" class="comp-bg bg-rb">

                <div v-if="closeVisible" @click="close" class="comp-close">
                    <img src="@/assets/images/modal-close.png" alt="" class="comp-close_img">
                </div>

                <div v-if="title" class="comp-title">{{title}}</div>

                <div class="comp-main">
                    <slot></slot>
                </div>

                <div class="comp-btn">
                     <Btn @click.native="confirm" v-if="btnText" class="">
                        {{btnText}}
                    </Btn>
                </div>
               
            </div>
        </transition>
        <x-mask v-if="compVisile" :visible.sync="compVisile"></x-mask>
    </div>
</template>

<script>
import XMask from './XMask.vue'
import Btn from './Btn.vue'

export default {
    data () {
        return {
            compVisile: false
        }
    },
    props: {
        pretty: Boolean,
        title: String,
        btnText: String,
        closeVisible: Boolean,
        visible: {
            default: false
        }
    },
    components: {
        XMask,
        Btn
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
            top: 50%;
            left: 50%;
            transform: translate3d(-50%, -50%, 0);
            width: 750px;
            background:rgba(31,2,91,1);
            border:3px solid rgba(115, 78, 173, 1);
            border-radius:12px;
            padding-bottom: 35px;
        }

        .comp-bg{
            position: absolute;
            z-index: 9;
            width: 106px;
        }

        .bg-lt{
            left: 0px;
            top: 0px;
        }

        .bg-lb{
            left: 0px;
            bottom: 0px;
        }

        .bg-rt{
            right: 0px;
            top: 0px;
        }

        .bg-rb{
            right: 0px;
            bottom: 0px;
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
            max-height: 400px;
            overflow: auto;
        }

        .comp-btn{
            
            margin: 60px auto 0px;
            text-align: center
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

