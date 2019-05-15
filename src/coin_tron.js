import Vue from 'vue'
import App from './views/coin/Tron.vue'
import i18n from '@/js/lang'
import Message from '@/components/message'
import Notify from '@/components/notify'
import "@/fonts/iconfont.js"

Vue.config.productionTip = false

Vue.use(Message)
Vue.use(Notify)


new Vue({
    i18n,
    render: h => h(App),
}).$mount('#app')
