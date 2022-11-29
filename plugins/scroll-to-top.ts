export default defineNuxtPlugin(() => {
  return {
    provide: {
      scrollToTop: () => {
        document.body.scrollTo(0, 0)
      },
    },
  }
})
