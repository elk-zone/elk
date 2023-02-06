import lifecycle from 'page-lifecycle/dist/lifecycle.mjs'
import { ELK_FROZEN } from '~/constants'

export default defineNuxtPlugin(() => {
  const state = ref(lifecycle.state)
  const frozenListeners: (() => void)[] = []

  lifecycle.addEventListener('statechange', (evt) => {
    if (evt.newState === 'freeze')
      /* isPWAInstalled && */frozenListeners.forEach(listener => listener())
    else
      state.value = evt.newState
  })

  const addFrozenListener = (listener: () => void) => {
    frozenListeners.push(listener)
  }

  if (useAppConfig().pwaEnabled) {
    addFrozenListener(() => {
      if (navigator.serviceWorker.controller)
        navigator.serviceWorker.controller.postMessage({ type: ELK_FROZEN })
    })
  }

  return {
    provide: {
      pageLifecycle: reactive({
        state,
        addFrozenListener,
      }),
    },
  }
})
