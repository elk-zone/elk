export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  const route = useRoute()
  const track = ref(false)
  const { y } = useWindowScroll()
  const storage = useLocalStorage<Record<string, number>>('elk-track-scroll', {})

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

  const restoreScroll = () => {
    const path = route.fullPath
    return nextTick().then(() => {
      if (route.meta && route.meta?.noScrollTrack) {
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

  nuxtApp.hooks.hook('app:suspense:resolve', () => {
    if (isHydrated.value) {
      restoreScroll().then(() => {
        track.value = true
      }).catch(noop)
    }
  })

  nuxtApp.hooks.hook('page:finish', () => {
    if (isHydrated.value) {
      restoreScroll().then(() => {
        track.value = true
      }).catch(noop)
    }
  })

  watch([track, y, () => route], ([trackEnabled, scrollPosition, r]) => {
    if (trackEnabled && (!r.meta || !r.meta?.noScrollTrack))
      storage.value[r.fullPath] = Math.floor(scrollPosition)
  }, { immediate: true, flush: 'pre' })

  return {
    provide: {
      trackScroll: reactive({
        forceScroll,
        restoreScroll,
        track,
      }),
    },
  }
})
