export default defineNuxtPlugin((nuxtApp) => {
  // eslint-disable-next-line no-console
  console.log('hydration', Date.now())
  nuxtApp.hooks.hookOnce('app:suspense:resolve', () => {
    isHydrated.value = true
  })
})
