export default defineNuxtRouteMiddleware((from) => {
  if (!currentUser.value)
    return navigateTo('/public')
  else if (from.path === '/')
    return navigateTo('/home')
})
