// Will be in next Nuxt release

const requestIdleCallback: Window['requestIdleCallback'] = process.server
  ? undefined as any
  : (globalThis.requestIdleCallback || ((cb) => {
      const start = Date.now()
      const idleDeadline = {
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      }
      return setTimeout(() => {
        cb(idleDeadline)
      }, 1)
    }))

export const onNuxtReady = (callback: () => any) => {
  const nuxtApp = useNuxtApp()
  if (nuxtApp.isHydrating)
    nuxtApp.hooks.hookOnce('app:suspense:resolve', () => { requestIdleCallback(callback) })

  else
    requestIdleCallback(callback)
}
