import type { VueI18n } from 'vue-i18n'
import type { LocaleObject } from 'vue-i18n-routing'

export default defineNuxtPlugin(async (nuxt) => {
  const i18n = nuxt.vueApp.config.globalProperties.$i18n as VueI18n
  const { setLocale, locales } = i18n
  const supportLanguages = (locales as LocaleObject[]).map(locale => locale.code)
  const userSettings = useUserSettings()
  const lang = userSettings.value.language

  if (process.client && !supportLanguages.includes(lang))
    userSettings.value.language = getDefaultLanguage(locales as string[])

  if (process.server) {
    if (lang !== i18n.locale)
      await setLocale(lang)
    return
  }

  watch(() => userSettings.value.language, (lang) => {
    if (lang !== i18n.locale)
      setLocale(lang)
  }, { immediate: true })
})
