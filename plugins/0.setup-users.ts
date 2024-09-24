import { useAsyncIDBKeyval } from '~/composables/idb'
import type { UserLogin } from '~/types'
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

    // when multiple tabs: we need to reload window when sign in, switch account or sign out
    if (import.meta.client) {
      // prevent reloading on the first visit
      const initialLoad = ref(true)

      await useAsyncIDBKeyval<UserLogin[]>(STORAGE_KEY_USERS, defaultUsers, users)

      watch(
        currentUserHandle,
        async (handle, oldHandle) => {
          if (initialLoad.value) {
            initialLoad.value = false
            return
          }

          let sameAcct: boolean
          // 1. detect account switching or sign-out
          if (oldHandle) {
            sameAcct = handle === oldHandle
          }
          else {
            const acct = currentUser.value?.account?.acct
            // 2. detect sign-in
            sameAcct = !acct || acct === handle
          }

          if (!sameAcct) {
            setTimeout(() => {
              window.location.reload()
            }, 0)
          }
        },
        { immediate: true, flush: 'post' },
      )
    }
  },
})
