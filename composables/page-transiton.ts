export const usePageTransition = (options: {
  beforeEach?: typeof noop
  afterHydrated?: typeof noop
  onTransitionError?: typeof noop
}) => {
  const nuxtApp = useNuxtApp()
  const router = useRouter()

  if (options.beforeEach) {
    router.beforeEach(() => {
      options.beforeEach?.()
    })
  }

  if (options.onTransitionError) {
    router.onError(() => {
      options.onTransitionError?.()
    })
  }

  if (options.afterHydrated) {
    const nuxtHook = () => {
      if (isHydrated.value)
        options.afterHydrated?.()
    }
    nuxtApp.hooks.hook('app:suspense:resolve', nuxtHook)
    nuxtApp.hooks.hook('page:finish', nuxtHook)
  }
}
