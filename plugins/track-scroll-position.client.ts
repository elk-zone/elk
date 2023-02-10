export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const route = useRoute()
  const track = ref(false)
  const { y } = useWindowScroll()
  const storage = useLocalStorage<Record<string, number>>('elk-track-scroll', {})
  const customRoutes = new Set<string>()

  router.beforeEach(async () => {
    track.value = false
  })
  router.onError(async () => {
    track.value = true
  })

  const forceScroll = () => {
    storage.value[route.fullPath] = 0
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const restoreScrollCallback = (ignoreCustomRoutes: boolean) => {
    const path = route.fullPath
    return nextTick().then(() => {
      if (route.meta?.noScrollTrack) {
        forceScroll()
        return Promise.resolve()
      }

      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (path !== route.fullPath) {
            reject(new Error('navigation canceled'))
            return
          }

          if (!route.meta || !route.meta?.noScrollTrack) {
            const r = ignoreCustomRoutes ? undefined : customRoutes.has(route.fullPath)
            if (r) {
              reject(new Error('custom routed detected'))
              return
            }

            const scrollPosition = storage.value[route.fullPath]
            if (scrollPosition)
              window.scrollTo(0, scrollPosition)
          }
          else {
            forceScroll()
          }

          resolve()
        }, 600)
      })
    })
  }

  const restoreScroll = () => restoreScrollCallback(false)

  const restoreScrollHook = () => {
    if (isHydrated.value) {
      restoreScroll().then(() => {
        track.value = true
      }).catch(noop)
    }
  }

  const restoreCustomPageScroll = () => restoreScrollCallback(true)

  nuxtApp.hooks.hook('app:suspense:resolve', restoreScrollHook)
  nuxtApp.hooks.hook('page:finish', restoreScrollHook)

  watch([track, y, () => route], ([trackEnabled, scrollPosition, r]) => {
    if (trackEnabled && (!r.meta || !r.meta?.noScrollTrack))
      storage.value[r.fullPath] = Math.floor(scrollPosition)
  }, { immediate: true, flush: 'pre' })

  const registerCustomRoute = (path: string) => {
    customRoutes.add(path)
  }

  return {
    provide: {
      trackScroll: reactive({
        forceScroll,
        restoreScroll,
        track,
        registerCustomRoute,
        restoreCustomPageScroll,
      }),
    },
  }
})
