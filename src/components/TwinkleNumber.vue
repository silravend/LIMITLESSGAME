<template>
    <div class="twinkle-number-comp" :style="{color: currentColor}">
        <svg v-for="(item, index) in icons" :key="index" class="icon" aria-hidden="true">
            <use :xlink:href="'#icon-shuzi' + item"></use>
        </svg>
    </div>
</template>

<script>
let timer
export default {
    data () {
        return {
            compVal: 0,
            color: ['#570A56', 'red', '#6c0db9', '#6137da', '#ffad39'],
            currentColor: '#570A56'
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

    computed : {
        icons () {
            return (this.compVal + '').split('')
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
        font-size: 150px;
        text-align: center;
        font-weight: bold
    }
</style>



