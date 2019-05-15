import compConfig from './Notification.vue'

export default {
    install (Vue) {
        const Comp = Vue.extend(compConfig)
        Vue.prototype.$notify = ({ text, duration } = {}) => {
            const vm = new Comp({
                propsData: { text, duration }
            })
            
            vm.$mount()
            document.querySelector('body').appendChild(vm.$el)
        }
    }
}