import compConfig from './Notification.vue'

export default {
    install (Vue) {
        const Comp = Vue.extend(compConfig)
        Vue.prototype.$notify = ({ type, text, duration } = {}) => {
            const vm = new Comp({
                propsData: { type, text, duration }
            })
            
            vm.$mount()
            document.querySelector('body').appendChild(vm.$el)
        }

        Vue.prototype.$success = function ( text = '',  duration = 2500 ) {
            this.$notify({
                type: 'success',
                text,
                duration
            })
        }

        Vue.prototype.$error = function ( text = '',  duration = 2500 ) {
            this.$notify({
                type: 'error',
                text,
                duration
            })
        }

        Vue.prototype.$warn = function ( text = '',  duration = 2500 ) {
            this.$notify({
                type: 'warning',
                text,
                duration
            })
        }
    }
}