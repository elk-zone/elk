import type { LocaleObject } from '@nuxtjs/i18n'

export default defineNuxtPlugin(async () => {
  const { locale, locales, setLocale } = useNuxtApp().$i18n
  const userSettings = useUserSettings()
  const lang = computed(() => userSettings.value.language)
  const useLocale = unref(locale)

  const supportLanguages = (unref(locales) as LocaleObject[]).map(locale => locale.code)
  if (!supportLanguages.includes(lang.value as string))
    userSettings.value.language = getDefaultLanguage(supportLanguages)

  if (lang.value !== useLocale)
    await setLocale(userSettings.value.language)

  watch([lang, isHydrated], () => {
    if (isHydrated.value && lang.value !== useLocale)
      setLocale(lang.value)
  }, { immediate: true })
})
