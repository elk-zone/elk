export default defineNuxtRouteMiddleware((to) => {
  if (!currentUser.value)
    return navigateTo('/public')
  if (to.path === '/')
    return navigateTo('/home')
})
