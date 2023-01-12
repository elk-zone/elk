import type { VueI18n } from 'vue-i18n'
import type { LocaleObject } from 'vue-i18n-routing'
import { COOKIE_KEY_LOCALE, COOKIE_MAX_AGE, DEFAULT_LANGUAGE } from '~/constants'

export default defineNuxtPlugin(async (nuxt) => {
  const i18n = nuxt.vueApp.config.globalProperties.$i18n as VueI18n
  const { setLocale, locales } = i18n
  const supportLocales = locales as LocaleObject[]
  const cookieLocale = useCookie(COOKIE_KEY_LOCALE, { maxAge: COOKIE_MAX_AGE })
  const userSettings = useUserSettings()

  if (process.server) {
    if (cookieLocale.value && cookieLocale.value !== i18n.locale) {
      userSettings.value.language = cookieLocale.value
      await setLocale(cookieLocale.value)
    }
    return
  }

  if (cookieLocale.value == null) {
    const settingLanguage = userSettings.value.language

    // if cookie not set, fallback to default language to match hydration
    userSettings.value.language = DEFAULT_LANGUAGE

    watchOnce(isHydrated, () => {
      // if not default language, use user's setting
      if (settingLanguage !== DEFAULT_LANGUAGE) {
        userSettings.value.language = settingLanguage
        return
      }

      // detect language from browser
      const userLang = (navigator.language || 'en-US').toLowerCase()
      // cause vue-i18n not explicit export LocaleObject type
      const lang = supportLocales.find(locale => userLang.startsWith(locale.code.toLowerCase()))?.code
          || supportLocales.find(locale => userLang.startsWith(locale.code.split('-')[0]))?.code
          || DEFAULT_LANGUAGE
      userSettings.value.language = lang
    })
  }
  else {
    userSettings.value.language = cookieLocale.value
  }

  watch(() => userSettings.value.language, (lang) => {
    if (lang !== cookieLocale.value)
      cookieLocale.value = lang
    if (lang !== i18n.locale)
      setLocale(lang)
  }, { immediate: true })
})
