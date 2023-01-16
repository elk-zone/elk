import { useRegisterSW } from 'virtual:pwa-register/vue'

export default defineNuxtPlugin(() => {
  const online = useOnline()
  const registrationError = ref(false)
  const swActivated = ref(false)

  // https://thomashunter.name/posts/2021-12-11-detecting-if-pwa-twa-is-installed
  const ua = navigator.userAgent
  const ios = ua.match(/iPhone|iPad|iPod/)
  const standalone = window.matchMedia('(display-mode: standalone)').matches
  const isInstalled = !!(standalone || (ios && !ua.match(/Safari/)))

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
      // should add support in pwa plugin
      if (r?.active?.state === 'activated') {
        swActivated.value = true
        registerPeriodicSync(swUrl, r)
      }
      else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker
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
        isInstalled,
        swActivated,
        registrationError,
        needRefresh,
        updateServiceWorker,
        close,
      }),
    },
  }
})
