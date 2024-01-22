import type { LocaleObject } from 'vue-i18n-routing'

export default defineNuxtPlugin(async () => {
  const { locale, locales, setLocale } = useNuxtApp().$i18n
  const userSettings = useUserSettings()
  const lang = $computed(() => userSettings.value.language)
  const useLocale = unref(locale)

  const supportLanguages = (unref(locales) as LocaleObject[]).map(locale => locale.code)
  if (!supportLanguages.includes(lang))
    userSettings.value.language = getDefaultLanguage(supportLanguages)

  if (lang !== useLocale)
    await setLocale(userSettings.value.language)

  watch([$$(lang), isHydrated], () => {
    if (isHydrated.value && lang !== useLocale)
      setLocale(lang)
  }, { immediate: true })
})
