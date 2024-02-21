import type { VueI18n } from 'vue-i18n'
import type { LocaleObject } from 'vue-i18n-routing'

export default defineNuxtPlugin(async (nuxt) => {
  const i18n = nuxt.vueApp.config.globalProperties.$i18n as VueI18n
  const { setLocale, locales } = i18n
  const userSettings = useUserSettings()
  const lang = computed(() => userSettings.value.language)

  const supportLanguages = (locales as LocaleObject[]).map(locale => locale.code)
  if (!supportLanguages.includes(lang.value))
    userSettings.value.language = getDefaultLanguage(supportLanguages)

  if (lang.value !== i18n.locale)
    await setLocale(userSettings.value.language)

  watch([lang, isHydrated], () => {
    if (isHydrated.value && lang.value !== i18n.locale)
      setLocale(lang.value)
  }, { immediate: true })
})
