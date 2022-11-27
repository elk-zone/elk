import { createI18n } from 'vue-i18n'
import enUS from '../locales/en-US.json'
import zhCn from '../locales/zh-CN.json'

/** Default language environment */
export const defaultLocale = 'en-US'

export const messages = {
  'en-US': enUS,
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
