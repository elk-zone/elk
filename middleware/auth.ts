export default defineNuxtRouteMiddleware((to) => {
  if (!currentUser.value)
    return navigateTo(`/${currentServer.value}/public`)
  if (to.path === '/')
    return navigateTo('/home')
})
