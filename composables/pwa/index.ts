import { useRegisterSW } from 'virtual:pwa-register/vue'

export const usePWA = () => {
  const online = useOnline()

  useHead({
    meta: [{ id: 'theme-color', name: 'theme-color', content: computed(() => isDark.value ? '#111111' : '#ffffff') }],
  })

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

  return {
    needRefresh,
    updateServiceWorker,
    close,
  }
}
