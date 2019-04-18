<template>
    <transition name="fade">
        <div v-if="compVisible" @click="close" class="x-mask-comp">
            
        </div>
    </transition>
</template>

<script>
export default {
    data () {
        return {
            compVisible: false
        }
    },
    props: {
        visible: {
            default: false
        },
        closeable: {
            default: false
        }
    },

    created () {
        
    },
    mounted () {
        this.compVisible = this.visible
    },

    methods: {
        close () {
            if (this.closeable) {
                this.compVisible = false
                this.$emit('update:visible', false)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../css/animate/fade.scss";

.x-mask-comp{
    position: fixed;
    z-index: 999;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;
    background: rgba(0,0,0, .6)
}
</style>
