import { COOKIE_KEY_LOCALE, COOKIE_MAX_AGE } from '~/constants'

export default defineNuxtPlugin(async (nuxt) => {
  const i18n = nuxt.vueApp.config.globalProperties.$i18n
  const { setLocale, locales } = nuxt.vueApp.config.globalProperties.$i18n
  const cookieLocale = useCookie(COOKIE_KEY_LOCALE, { maxAge: COOKIE_MAX_AGE })
  const isFirstVisit = cookieLocale.value == null

  if (process.client && isFirstVisit) {
    const userLang = (navigator.language || 'en-US').toLowerCase()
    // cause vue-i18n not explicit export LocaleObject type
    const supportLocales = unref(locales) as { code: string }[]
    const lang = supportLocales.find(locale => userLang.startsWith(locale.code.toLowerCase()))?.code
      || supportLocales.find(locale => userLang.startsWith(locale.code.split('-')[0]))?.code
    cookieLocale.value = lang || 'en-US'
  }

  if (cookieLocale.value && cookieLocale.value !== i18n.locale)
    await setLocale(cookieLocale.value)

  if (process.client) {
    watchEffect(() => {
      cookieLocale.value = i18n.locale
    })
  }
})
