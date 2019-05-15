<template>
    <transition name="notification">
        <div v-if="visible" class="notification-comp" v-html="text"></div>
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
            default: '张三丰赢取 11.5 TRX'
        },
        
        duration: {
            default: 3000
        },
    },

    mounted () {
        this.$nextTick(() => {
            this.visible = true
        })
        
        if (this.duration ){
            setTimeout(() => {
                this.visible = false
            }, this.duration)
        }
        
    }
}
</script>

<style lang="scss" scoped>
    .notification-comp{
       position: fixed;
       bottom: 20px;
       right: 20px;
       padding: 0 40px;
       background: rgba(0,0,0, .5);
       border-radius: 8px;
       height: 50px;
       line-height: 50px;
       color: #fff;
    }

    .icon{
        font-size: 20px;
        margin-right: 10px;
        vertical-align: middle
    }

    .notification-enter-active, .notification-leave-active {
        transition: all .45s;
    }

    .notification-enter, .notification-leave-to /* .fade-leave-active below version 2.1.8 */ {
        
        transform: translate(100%, 0px)
    }
</style>

