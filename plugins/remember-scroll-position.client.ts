import type { mastodon } from 'masto'

import { STORAGE_KEY_LAST_SCROLL_POSITION } from '~/constants'

interface RestoreScroll {
  id: string
  type: 'status' | 'follow'
  position: number
}

export default defineNuxtPlugin(() => {
  const lastStatus = useSessionStorage<Record<string, RestoreScroll>>(STORAGE_KEY_LAST_SCROLL_POSITION, {})
  return {
    provide: {
      preventScrollToTop: (path: string) => {
        return !!lastStatus.value[path]
      },
      restoreScrollPosition: () => {
        const restore = lastStatus.value[useRoute().fullPath]
        if (restore) {
          const el = restore.type === 'status'
            ? document.getElementById(`status-${restore.id}`)
            : document.querySelector(`a[href="${restore.id}"]`)
          if (el) {
            if (typeof restore.position === 'undefined')
              el.scrollIntoView()
            else
              window.scrollTo(0, restore.position)
          }
          else {
            delete lastStatus.value[useRoute().fullPath]
          }
        }
      },
      rememberAccountPosition: (account: string) => {
        lastStatus.value[useRoute().fullPath] = { id: account, type: 'follow', position: window.scrollY }
      },
      rememberStatusPosition: (status: mastodon.v1.Status) => {
        lastStatus.value[useRoute().fullPath] = { id: status.id, type: 'status', position: window.scrollY }
      },
    },
  }
})
