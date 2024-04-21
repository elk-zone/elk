export default defineNuxtRouteMiddleware((to) => {
  const experimentalViewTransitions = usePreferences('experimentalViewTransitions')
  to.meta.viewTransition = experimentalViewTransitions.value
})
