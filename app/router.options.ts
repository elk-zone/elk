
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig> {
  scrollBehavior: (to, from, savedPosition) => {
    const status = to.params?.status
    if (status) {
      // For /:account/:status route, scroll to the post
      return {
        selector: `#status-${status}`,
        behavior: 'smooth',
      }
    }
    else if (savedPosition) {
      return savedPosition
    }
    else {
      return { top: 0 }
    }
  }
}
