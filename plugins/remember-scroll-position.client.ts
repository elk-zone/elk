import type { Status } from 'masto'

import { STORAGE_KEY_LAST_SCROLL_POSITION } from '~/constants'

export default defineNuxtPlugin(() => {
  const lastStatus = useSessionStorage<Record<string, string>>(STORAGE_KEY_LAST_SCROLL_POSITION, {})
  return {
    provide: {
      restoreScrollPosition: () => {
        const statusId = lastStatus.value[useRoute().fullPath]
        if (statusId) {
          const el = document.getElementById(`status-${statusId}`)
          if (el)
            nextTick().then(() => el?.scrollIntoView())
          else
            delete lastStatus.value[useRoute().fullPath]
        }
      },
      rememberScrollPosition: (status: Status) => {
        lastStatus.value[useRoute().fullPath] = status.id
      },
    },
  }
})
