import type { Locale } from '#i18n'

export default defineNuxtPlugin(async (nuxt) => {
  const t = nuxt.vueApp.config.globalProperties.$t
  const d = nuxt.vueApp.config.globalProperties.$d
  const n = nuxt.vueApp.config.globalProperties.$n

  nuxt.vueApp.config.globalProperties.$t = wrapI18n(t)
  nuxt.vueApp.config.globalProperties.$d = wrapI18n(d)
  nuxt.vueApp.config.globalProperties.$n = wrapI18n(n)

  if (import.meta.client) {
    const i18n = useNuxtApp().$i18n
    const { setLocale, locales } = i18n
    const userSettings = useUserSettings()
    const lang = computed(() => userSettings.value.language as Locale)

    const supportLanguages = unref(locales).map(locale => locale.code)
    if (!supportLanguages.includes(lang.value))
      userSettings.value.language = getDefaultLanguage(supportLanguages)

    if (lang.value !== i18n.locale)
      await setLocale(userSettings.value.language as Locale)

    watch([lang, isHydrated], () => {
      if (isHydrated.value && lang.value !== i18n.locale)
        setLocale(lang.value)
    }, { immediate: true })
  }
})
