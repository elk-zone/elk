export default defineNuxtRouteMiddleware((from) => {
  const token = useCookie('nuxtodon-token')

  if (!token.value)
    return navigateTo('/public')
  else if (from.path === '/')
    return navigateTo('/home')
})
