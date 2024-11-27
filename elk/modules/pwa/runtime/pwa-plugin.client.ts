import type { UnwrapNestedRefs } from 'vue'
import type { PwaInjection } from './types'
import { useRegisterSW } from 'virtual:pwa-register/vue'
import { STORAGE_KEY_PWA_HIDE_INSTALL } from '~/constants'

export default defineNuxtPlugin(() => {
  const online = useOnline()
  const registrationError = ref(false)
  const swActivated = ref(false)
  const showInstallPrompt = ref(false)
  const hideInstall = useLocalStorage(STORAGE_KEY_PWA_HIDE_INSTALL, false)

  // https://thomashunter.name/posts/2021-12-11-detecting-if-pwa-twa-is-installed
  const ua = navigator.userAgent
  const ios = ua.match(/iPhone|iPad|iPod/)
  const standalone = window.matchMedia('(display-mode: window-controls-overlay)').matches
    || window.matchMedia('(display-mode: standalone)').matches
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
    needRefresh,
    updateServiceWorker,
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

  let install: () => Promise<void> = () => Promise.resolve()
  let cancelInstall: () => void = noop

  if (!hideInstall.value) {
    type InstallPromptEvent = Event & {
      prompt: () => void
      userChoice: Promise<{ outcome: 'dismissed' | 'accepted' }>
    }

    let deferredPrompt: InstallPromptEvent | undefined

    const beforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      deferredPrompt = e as InstallPromptEvent
      showInstallPrompt.value = true
    }
    window.addEventListener('beforeinstallprompt', beforeInstallPrompt)
    window.addEventListener('appinstalled', () => {
      deferredPrompt = undefined
      showInstallPrompt.value = false
    })

    cancelInstall = () => {
      deferredPrompt = undefined
      showInstallPrompt.value = false
      window.removeEventListener('beforeinstallprompt', beforeInstallPrompt)
      hideInstall.value = true
    }

    install = async () => {
      if (!showInstallPrompt.value || !deferredPrompt) {
        showInstallPrompt.value = false
        return
      }

      showInstallPrompt.value = false
      await nextTick()
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
    }
  }

  return {
    provide: {
      pwa: reactive({
        isInstalled,
        showInstallPrompt,
        cancelInstall,
        install,
        swActivated,
        registrationError,
        needRefresh,
        updateServiceWorker,
        close,
      }) satisfies UnwrapNestedRefs<PwaInjection>,
    },
  }
})
