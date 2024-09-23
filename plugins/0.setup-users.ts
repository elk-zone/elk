import { useAsyncIDBKeyval } from '~/composables/idb'
import type { UserLogin } from '~/types'
import { STORAGE_KEY_USERS } from '~/constants'

const mock = process.mock

export default defineNuxtPlugin({
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
    if (import.meta.client) {
      await useAsyncIDBKeyval<UserLogin[]>(STORAGE_KEY_USERS, defaultUsers, { deep: true }, users)
    }

    if (removeUsersOnLocalStorage)
      globalThis.localStorage.removeItem(STORAGE_KEY_USERS)
  },
})
