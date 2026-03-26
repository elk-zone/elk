export default defineNuxtPlugin(() => {
  return {
    provide: {
      scrollToTop: () => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      },
    },
  }
})
