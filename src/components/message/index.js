import compConfig from './Message.vue'

export default {
    install (Vue) {
        const Comp = Vue.extend(compConfig)
        Vue.prototype.$message = ({ type, text, duration } = {}) => {
            const vm = new Comp({
                propsData: { type, text, duration }
            })
            
            vm.$mount()
            document.querySelector('body').appendChild(vm.$el)
        }

        Vue.prototype.$success = function ( text = '',  duration = 2500 ) {
            this.$message({
                type: 'success',
                text,
                duration
            })
        }

        Vue.prototype.$error = function ( text = '',  duration = 2500 ) {
            this.$message({
                type: 'error',
                text,
                duration
            })
        }

        Vue.prototype.$warn = function ( text = '',  duration = 2500 ) {
            this.$message({
                type: 'warning',
                text,
                duration
            })
        }
    }
}