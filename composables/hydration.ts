export const isHydrated = computed(() => {
  if (process.server)
    return false

  const nuxtApp = useNuxtApp()
  if (!nuxtApp.isHydrating)
    return false

  const hydrated = ref(false)
  nuxtApp.hooks.hookOnce('app:suspense:resolve', () => {
    hydrated.value = true
  })
  return hydrated
})
