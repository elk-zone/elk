export default defineNuxtRouteMiddleware((to) => {
  if (process.server)
    return
  if (to.path === '/signin/callback')
    return

  if (!isMastoInitialised.value) {
    watchOnce(isMastoInitialised, () => {
      if (!currentUser.value)
        return navigateTo(`/${currentServer.value}/public`)
      if (to.path === '/')
        return navigateTo('/home')
    })
    return
  }

  if (!currentUser.value)
    return navigateTo(`/${currentServer.value}/public`)
  if (to.path === '/')
    return navigateTo('/home')
})
