import lifecycle from 'page-lifecycle/dist/lifecycle.mjs'
import { ELK_PAGE_LIFECYCLE_FROZEN } from '~/constants'
import { closeDatabases } from '~/utils/elk-idb'

export default defineNuxtPlugin(() => {
  const state = ref(lifecycle.state)
  const frozenListeners: (() => void)[] = []

  lifecycle.addEventListener('statechange', (evt) => {
    if (evt.newState === 'freeze')
      frozenListeners.forEach(listener => listener())
    else
      state.value = evt.newState
  })

  const addFrozenListener = (listener: () => void) => {
    frozenListeners.push(listener)
  }

  addFrozenListener(() => {
    if (useAppConfig().pwaEnabled && navigator.serviceWorker.controller)
      navigator.serviceWorker.controller.postMessage(ELK_PAGE_LIFECYCLE_FROZEN)

    closeDatabases()
  })

  return {
    provide: {
      pageLifecycle: reactive({
        state,
        addFrozenListener,
      }),
    },
  }
})
