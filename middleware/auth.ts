export default defineNuxtRouteMiddleware((to) => {
  if (process.server)
    return
  if (!currentUser.value && to.path !== '/signin/callback')
    return navigateTo(`/${currentServer.value}/public`)
  if (to.path === '/')
    return navigateTo('/home')
})
