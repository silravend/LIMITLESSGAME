<template>
    <div class="btn" :style="{height: height + 'px', lineHeight: height + 'px', width: width + 'px', fontSize: fontSize + 'px'}">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        height:{
            default: 48
        },
        width: {
            default: 144
        },
        fontSize: {
            default: 20
        }
    }
}
</script>

<style lang="scss" scoped>
 .btn{
    display: inline-block;
    font-weight:bold;
    color:rgba(128,216,255,1);
    text-align: center;
    background: url(../assets/images/modal-btn.png) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
}
</style>


