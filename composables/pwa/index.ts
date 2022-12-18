import { useRegisterSW } from 'virtual:pwa-register/vue'

export const usePWA = () => {
  const online = useOnline()

  const {
    needRefresh,
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl, r) {
      if (!r || r.installing)
        return

      setInterval(async () => {
        if (!online.value)
          return

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            'cache': 'no-store',
            'cache-control': 'no-cache',
          },
        })

        if (resp?.status === 200)
          await r.update()
      }, 60 * 60 * 1000 /* 1 hour */)
    },
  })

  const close = async () => {
    needRefresh.value = false
  }

  watchDebounced(isDark, (dark) => {
    document.documentElement.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark === true ? '#111111' : '#ffffff')
  }, { debounce: 100, flush: 'post' })

  return {
    needRefresh,
    updateServiceWorker,
    close,
  }
}
