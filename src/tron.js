import Vue from 'vue'
import App from './views/Tron.vue'
import Notification from '@/components/notification'
import "@/fonts/iconfont.js"

Vue.config.productionTip = false

Vue.use(Notification)

new Vue({
  render: h => h(App),
}).$mount('#app')
