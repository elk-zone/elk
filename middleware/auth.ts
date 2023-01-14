export default defineNuxtRouteMiddleware((to) => {
  if (process.server)
    return
  if (to.path === '/signin/callback')
    return

  onMastoInit(() => {
    if (!currentUser.value) {
      if (to.path === '/home' && to.query['share-target'] !== undefined)
        return navigateTo('/share-target')
      else
        return navigateTo(`/${currentServer.value}/public/local`)
    }
    if (to.path === '/')
      return navigateTo('/home')
  })
})
