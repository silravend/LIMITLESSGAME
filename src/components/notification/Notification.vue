<template>
    <transition>
        <div v-if="visible" class="notification-comp" :class="[type]">
            {{text}}
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

    created () {
        this.visible = true
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
        height: 45px;
        line-height: 45px;
        min-width: 200px;
        text-align: center;

        &.error{
            color: #F56C6C
        }
    }
</style>

