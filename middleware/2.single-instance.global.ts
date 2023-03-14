export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server || !useRuntimeConfig().public.singleInstance)
    return

  if (to.params.server) {
    const newTo = { ...to }
    delete newTo.params.server
    return newTo
  }
})
