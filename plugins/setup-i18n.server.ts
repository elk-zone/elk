export default defineNuxtPlugin((nuxt) => {
  const t = nuxt.vueApp.config.globalProperties.$t
  const d = nuxt.vueApp.config.globalProperties.$d
  const n = nuxt.vueApp.config.globalProperties.$n

  nuxt.vueApp.config.globalProperties.$t = wrapI18n(t)
  nuxt.vueApp.config.globalProperties.$d = wrapI18n(d)
  nuxt.vueApp.config.globalProperties.$n = wrapI18n(n)
})
