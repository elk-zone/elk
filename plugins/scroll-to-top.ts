export default defineNuxtPlugin((/* nuxtApp */) => {
  return {
    provide: {
      scrollToTop: () => {
        // if (typeof force === 'boolean' && force)
        //   nuxtApp.$trackScroll.forceScroll()

        // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      },
    },
  }
})
