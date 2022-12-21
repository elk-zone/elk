const reloadRoutes = new Set(['/invite'])

export default defineNuxtRouteMiddleware((to) => {
  if (process.client && reloadRoutes.has(to.fullPath))
    window.location.pathname = to.path
})
