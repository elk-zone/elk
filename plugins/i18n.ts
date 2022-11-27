import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import zhCn from '../locales/zh-CN.json'

/** Default language environment */
export const defaultLocale = 'en'

export const messages = {
  en,
  'zh-CN': zhCn,
}

/** Language Environment List */
export const localeList = Object.keys(messages)

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: defaultLocale,
    messages,
  })

  vueApp.use(i18n)
})
