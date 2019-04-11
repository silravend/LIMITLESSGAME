import compConfig from './Notification.vue'

export default {
    install (Vue) {
        const Comp = Vue.extend(compConfig)
        Vue.prototype.$notify = () => {
            const vm = new Comp({
                propsData: {
                    
                }
            })
            
            vm.$mount()
            document.querySelector('body').appendChild(vm.$el)
        }
    }
}