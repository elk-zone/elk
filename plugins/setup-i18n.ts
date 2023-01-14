import type { VueI18n } from 'vue-i18n'
import type { LocaleObject } from 'vue-i18n-routing'
import { COOKIE_KEY_LOCALE, COOKIE_MAX_AGE, DEFAULT_LANGUAGE } from '~/constants'

export default defineNuxtPlugin(async (nuxt) => {
  const i18n = nuxt.vueApp.config.globalProperties.$i18n as VueI18n
  const { setLocale, locales } = i18n
  const supportLanguages = (locales as LocaleObject[]).map(locale => locale.code)
  const cookieLocale = useCookie(COOKIE_KEY_LOCALE, { maxAge: COOKIE_MAX_AGE })
  const userSettings = useUserSettings()

  if (process.server) {
    const headers = useRequestHeaders()

    let lang = cookieLocale.value
    if (!lang || !supportLanguages.includes(lang)) {
      // first visit
      if (headers['accept-language']) {
        // detect language from header
        const userLanguages = headers['accept-language'].split(',').map(lang => lang.split(';')[0].toLowerCase())
        lang = matchLanguages(supportLanguages, userLanguages) || DEFAULT_LANGUAGE
      }
      else {
        lang = DEFAULT_LANGUAGE
      }
    }
    userSettings.value.language = cookieLocale.value = lang

    if (lang !== i18n.locale)
      await setLocale(cookieLocale.value)

    return
  }

  // could be null if browser don't accept cookie
  if (!cookieLocale.value || !supportLanguages.includes(cookieLocale.value))
    cookieLocale.value = DEFAULT_LANGUAGE
  userSettings.value.language = cookieLocale.value

  watch(() => userSettings.value.language, (lang) => {
    if (lang !== cookieLocale.value)
      cookieLocale.value = lang
    if (lang !== i18n.locale)
      setLocale(lang)
  }, { immediate: true })
})
