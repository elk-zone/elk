import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware((to) => {
  if (process.server)
    return

  if (to.path === '/signin/callback')
    return

  if (isHydrated.value)
    return handleAuth(to)

  onHydrated(() => handleAuth(to))
})

function handleAuth(to: RouteLocationNormalized) {
  if (!currentUser.value) {
    if (to.path === '/home' && to.query['share-target'] !== undefined)
      return navigateTo('/share-target')
    else
      return navigateTo(`/${currentServer.value}/public/local`)
  }
  if (to.path === '/')
    return navigateTo('/home')
}
