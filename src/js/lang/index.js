import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en'
import zh from './zh'
import kr from './kr'

Vue.use(VueI18n)

const i18n = new VueI18n({
    locale: localStorage.getItem('lang') || 'en',
    messages: {
        en,
        zh,
        kr
    }
})

export default i18n