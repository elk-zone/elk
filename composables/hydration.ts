export const isHydrated = computed(() => {
  if (process.server)
    return { value: false }

  const nuxtApp = useNuxtApp()
  if (!nuxtApp.isHydrating)
    return { value: false }

  const hydrated = ref(false)
  nuxtApp.hooks.hookOnce('app:suspense:resolve', () => {
    hydrated.value = true
  })
  return hydrated
})
