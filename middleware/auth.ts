export default defineNuxtRouteMiddleware((to) => {
  if (process.server)
    return
  if (to.path === '/signin/callback')
    return

  onMastoInit(() => {
    if (isGuest.value)
      return navigateTo(`/${currentServer.value}/public`)
    if (to.path === '/')
      return navigateTo('/home')
  })
})
