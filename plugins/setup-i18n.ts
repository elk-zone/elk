import type { VueI18n } from 'vue-i18n'
import type { LocaleObject } from 'vue-i18n-routing'
import { DEFAULT_LANGUAGE } from '~/constants'

export default defineNuxtPlugin(async (nuxt) => {
  const i18n = nuxt.vueApp.config.globalProperties.$i18n as VueI18n
  const { setLocale, locales } = i18n
  const supportLanguages = (locales as LocaleObject[]).map(locale => locale.code)
  const userSettings = useUserSettings()

  if (process.server) {
    const headers = useRequestHeaders()

    let lang = userSettings.value.language
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

    if (lang !== i18n.locale)
      await setLocale(userSettings.value.language)

    return
  }

  // could be null if browser don't accept cookie
  if (!userSettings.value.language || !supportLanguages.includes(userSettings.value.language))
    userSettings.value.language = DEFAULT_LANGUAGE

  watch(() => userSettings.value.language, (lang) => {
    if (lang !== i18n.locale)
      setLocale(lang)
  }, { immediate: true })
})
