export const isHydrated = ref(false)

if (!process.server) {
  const nuxtApp = useNuxtApp()
  nuxtApp.hooks.hookOnce('app:suspense:resolve', () => {
    isHydrated.value = true
  })
}
