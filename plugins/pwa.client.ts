import { useRegisterSW } from 'virtual:pwa-register/vue'

export default defineNuxtPlugin(() => {
  const online = useOnline()
  const registrationError = ref(false)
  const swActivated = ref(false)

  const registerPeriodicSync = (swUrl: string, r: ServiceWorkerRegistration) => {
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
  }

  const {
    needRefresh, updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisterError() {
      registrationError.value = true
    },
    onRegisteredSW(swUrl, r) {
      if (r?.active?.state === 'activated') {
        swActivated.value = true
        registerPeriodicSync(swUrl, r)
      }
      else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker
          // eslint-disable-next-line no-console
          console.log(sw.state)
          swActivated.value = sw.state === 'activated'
          if (swActivated.value)
            registerPeriodicSync(swUrl, r)
        })
      }
    },
  })

  const close = async () => {
    needRefresh.value = false
  }

  return {
    provide: {
      pwa: reactive({
        swActivated,
        registrationError,
        needRefresh,
        updateServiceWorker,
        close,
      }),
    },
  }
})
