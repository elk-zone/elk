import type { UserLogin } from '~/types'
import { useAsyncIDBKeyval } from '~/composables/idb'
import { STORAGE_KEY_USERS } from '~/constants'

const mock = process.mock

export default defineNuxtPlugin({
  enforce: 'pre',
  parallel: import.meta.server,
  async setup() {
    const users = useUsers()

    let defaultUsers = mock ? [mock.user] : []

    // Backward compatibility with localStorage
    let removeUsersOnLocalStorage = false
    if (globalThis?.localStorage) {
      const usersOnLocalStorageString = globalThis.localStorage.getItem(STORAGE_KEY_USERS)
      if (usersOnLocalStorageString) {
        defaultUsers = JSON.parse(usersOnLocalStorageString)
        removeUsersOnLocalStorage = true
      }
    }

    if (import.meta.server) {
      users.value = defaultUsers
    }

    if (removeUsersOnLocalStorage)
      globalThis.localStorage.removeItem(STORAGE_KEY_USERS)

    let callback = noop

    // when multiple tabs: we need to reload window when sign in, switch account or sign out
    if (import.meta.client) {
      // prevent reloading on the first visit
      const initialLoad = ref(true)

      callback = () => (initialLoad.value = false)

      const { readIDB } = await useAsyncIDBKeyval<UserLogin[]>(STORAGE_KEY_USERS, defaultUsers, users)

      function reload() {
        setTimeout(() => {
          window.location.reload()
        }, 0)
      }

      debouncedWatch(
        () => [currentUserHandle.value, users.value.length] as const,
        async ([handle, currentUsers], old) => {
          if (initialLoad.value) {
            return
          }

          const oldHandle = old?.[0]

          // read database users: it is not reactive
          const dbUsers = await readIDB()

          const numberOfUsers = dbUsers?.length || 0

          // sign in or sign out
          if (currentUsers !== numberOfUsers) {
            reload()
            return
          }

          let sameAcct: boolean
          // 1. detect account switching
          if (oldHandle) {
            sameAcct = handle === oldHandle
          }
          else {
            const acct = currentUser.value?.account?.acct
            // 2. detect sign-in?
            sameAcct = !acct || acct === handle
          }

          if (!sameAcct) {
            reload()
          }
        },
        { debounce: 450, flush: 'post', immediate: true },
      )
    }

    const { params, query } = useRoute()

    publicServer.value = params.server as string || useRuntimeConfig().public.defaultServer

    const masto = createMasto()
    const user = (typeof query.server === 'string' && typeof query.token === 'string')
      ? {
          server: query.server,
          token: query.token,
          vapidKey: typeof query.vapid_key === 'string' ? query.vapid_key : undefined,
        }
      : (currentUser.value || { server: publicServer.value })

    if (import.meta.client) {
      loginTo(masto, user).finally(callback)
    }

    return {
      provide: {
        masto,
      },
    }
  },
})
