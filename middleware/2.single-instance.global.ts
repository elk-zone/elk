export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server || !useAppConfig().singleInstanceServer)
    return

  if (to.params.server) {
    const newTo = { ...to }
    delete newTo.params.server
    return newTo
  }
})
