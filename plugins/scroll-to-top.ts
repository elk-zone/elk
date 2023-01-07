export default defineNuxtPlugin((nuxt) => {
  return {
    provide: {
      scrollToTop: (evt?: MouseEvent | KeyboardEvent) => {
        const path = evt?.composedPath?.() as HTMLElement[]
        const el = path?.find(el => el.tagName?.toUpperCase() === 'A') as HTMLAnchorElement
        if (el?.href) {
          if (nuxt.$preventScrollToTop(new URL(el.href, import.meta.url).pathname))
            return
        }

        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      },
    },
  }
})
