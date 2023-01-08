export default defineNuxtRouteMiddleware((to) => {
  if (process.server)
    return
  if (to.path === '/signin/callback')
    return

  onMastoInit(() => {
    if (!currentUser.value)
      return navigateTo(`/${currentServer.value}/public/local`)
    if (to.path === '/')
      return navigateTo('/home')
  })
})
