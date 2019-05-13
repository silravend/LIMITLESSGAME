import Vue from 'vue'
import App from './views/horse/Tron.vue'
import i18n from '@/js/lang'
import Notification from '@/components/notification'
import "@/fonts/iconfont.js"
import preload from '@/js/plugins/preload_image'

preload([
    'https://api1.limitless.vip/download?url=horse1.gif', 
    'https://api1.limitless.vip/download?url=horse2.gif', 
    'https://api1.limitless.vip/download?url=horse3.gif', 
    'https://api1.limitless.vip/download?url=horse4.gif', 
    'https://api1.limitless.vip/download?url=horse5.gif',
    'https://api1.limitless.vip/download?url=horse6.gif'
])


Vue.config.productionTip = false

Vue.use(Notification)

new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app')
