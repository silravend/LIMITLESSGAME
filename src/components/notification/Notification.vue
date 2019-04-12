<template>
    <transition name="notify">
        <div v-if="visible" class="notification-comp" :class="[type]">
            <svg v-if="type == 'success' " class="icon" aria-hidden="true">
                <use xlink:href="#icon-success-circle"></use>
            </svg>
            <svg v-if="type == 'error' " class="icon" aria-hidden="true">
                <use xlink:href="#icon-shibai-yin"></use>
            </svg>
            <svg v-if="type == 'warning' "  class="icon" aria-hidden="true">
                <use xlink:href="#icon-jinggao"></use>
            </svg>
            <span>{{text}}</span>
        </div>
    </transition>
</template>

<script>
export default {
    data () {
        return {
            visible: false
        }
    },
    props: {
        text: {
            default: '请求失败'
        },
        
        duration: {
            default: 2500
        },

        type: {
            default: 'error'
        }
    },

    mounted () {
        this.$nextTick(() => {
            this.visible = true
        })
        
        setTimeout(() => {
            this.visible = false
        }, this.duration)
    }
}
</script>

<style lang="scss" scoped>
    .notification-comp{
        position: fixed;
        z-index: 10001;
        left: 50%;
        top: 20%;
        transform: translate(-50%,0);
        border-radius: 4px;
        background: #fff;
        font-size: 16px;
        height: 48px;
        line-height: 48px;
        min-width: 140px;
        text-align: center;
        padding: 0 30px;

        &.success {
            color: rgba(11, 234, 106, 0.8)
        }

        &.error{
            color: rgba(234, 11, 11, 0.8)
        }

        &.warning{
            color: #ffad39
        }
    }

    .icon{
        font-size: 20px;
        margin-right: 10px;
        vertical-align: middle
    }

    .notify-enter-active, .notify-leave-active {
        transition: all .5s;
    }

    .notify-enter, .notify-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
        transform: translate(-50%, -20px)
    }
</style>

