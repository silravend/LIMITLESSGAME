import Vue from 'vue'
import App from './views/dice/Tron.vue'
import i18n from '@/js/lang'
import Notification from '@/components/notification'
import "@/fonts/iconfont.js"

Vue.config.productionTip = false

Vue.use(Notification)

console.log(123213)


new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app')
