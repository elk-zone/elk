export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (_, vm) => {
    // This is a global error handler that will catch all errors
    // We've included a global error page that will be displayed
    // in case we have an unhandled error
    if (vm) {
      const route = vm.$route
      if (route && route.path !== '/error')
        vm.$router.push('/error')
    }
  }
})
