export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:view-transition:start', (transition) => {
    const viewTransitionFinished = getIsViewTransitionFinished()
    viewTransitionFinished.value = false

    transition.finished
      .then(() => viewTransitionFinished.value = true)
  })
})
