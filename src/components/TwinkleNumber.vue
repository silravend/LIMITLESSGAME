<template>
    <div class="twinkle-number-comp" :style="{color: currentColor}">
        {{compVal}}
    </div>
</template>

<script>
let timer
export default {
    data () {
        return {
            compVal: 0,
            color: ['#fff', 'red', '#6c0db9', '#6137da', '#ffad39'],
            currentColor: '#fff'
        }
    },
    props: {
        min: {
            default: 4
        },

        max: {
            default: 96
        },

        start: {
            default: false
        },
        
        val: {
            default: 10
        },
        speed: {
            default: 100
        }
    },

    watch: {
        start (newVal) {
            if (newVal) {
                this.ani()
            }else {
               this.stopAni()
            }
        }
    },

    created () {
        this.compVal = this.val
    },

    mounted () {
        if (this.start) {
            this.ani()
        }
    },

    methods: {
        ani () {
            const len = this.color.length - 1

            timer = setInterval(() => {
                this.compVal = Math.round(Math.random() * (this.max - this.min) + this.min)
                this.currentColor = this.color[Math.round(Math.random() * len)]
            }, this.speed)
        },

        stopAni () {
            clearInterval(timer)
            this.compVal = this.val
            this.currentColor = '#fff'
        }
    }
}
</script>

<style lang="scss" scoped>
    .twinkle-number-comp{
        font-size: 120px;
        text-align: center;
        font-weight: bold
    }
</style>



