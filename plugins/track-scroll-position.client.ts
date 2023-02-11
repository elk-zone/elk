export default defineNuxtPlugin(() => {
  const route = useRoute()
  const track = ref(false)
  const { y } = useWindowScroll()
  const storage = useLocalStorage<Record<string, number>>('elk-track-scroll', {})
  const customRoutes = new Set<string>()

  const forceScrollToTop = () => {
    storage.value[route.fullPath] = 0
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  const restoreScrollCallback = (ignoreCustomRoutes: boolean) => {
    const path = route.fullPath
    return nextTick().then(() => {
      if (route.meta?.noScrollTrack) {
        forceScrollToTop()
        return Promise.resolve()
      }

      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          const fullPath = route.fullPath
          if (path !== fullPath) {
            reject(new Error('navigation canceled'))
            return
          }

          const r = ignoreCustomRoutes ? undefined : customRoutes.has(fullPath)
          if (r) {
            reject(new Error('custom routed detected'))
            return
          }

          const scrollPosition = storage.value[fullPath]
          if (scrollPosition)
            window.scrollTo(0, scrollPosition)

          // required for custom routes: first call will be rejected
          // we need to enable scroll tracking again, it is disabled
          if (!track.value) {
            nextTick().then(() => {
              track.value = true
            })
          }

          resolve()
        }, 600)
      })
    })
  }

  const restoreScroll = () => restoreScrollCallback(false)

  const restoreCustomPageScroll = () => restoreScrollCallback(true)

  usePageTransition({
    beforeEach: () => {
      track.value = false
    },
    afterHydrated: () => {
      restoreScroll().then(() => {
        track.value = true
      }).catch(noop)
    },
    onTransitionError: () => {
      track.value = true
    },
  })

  watch([track, y, () => route], ([trackEnabled, scrollPosition, r]) => {
    if (trackEnabled && (!r.meta || !r.meta?.noScrollTrack))
      storage.value[r.fullPath] = Math.floor(scrollPosition)
  }, { immediate: true, flush: 'pre' })

  const registerCustomRoute = (path: string) => {
    customRoutes.add(path)
  }

  return {
    provide: {
      trackScroll: {
        forceScrollToTop,
        registerCustomRoute,
        restoreCustomPageScroll,
      },
    },
  }
})
