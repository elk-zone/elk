import { useAsyncIDBKeyval } from '~/composables/idb'
import type { UserLogin } from '~/types'
import { STORAGE_KEY_USERS } from '~/constants'

const mock = process.mock

export default defineNuxtPlugin({
  parallel: false,
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

    let notifyCredentialsChanged = (_acct?: string) => {}

    // when multiple tabs: we need to reload window when sign in, switch account or sign out
    if (import.meta.client) {
      const handlingMessage = ref(false)
      const channel = new BroadcastChannel('elk')

      onBeforeUnmount(() => {
        channel.close()
      })

      channel.addEventListener('message', () => {
        if (!handlingMessage.value) {
          setTimeout(() => {
            // force reload home page
            reloadNuxtApp({
              ttl: 0,
              force: true,
              path: '/',
            })
          }, 0)
          return
        }
        handlingMessage.value = false
      })

      notifyCredentialsChanged = (acct) => {
        handlingMessage.value = true
        nextTick(() => channel.postMessage(acct || ''))
      }

      await useAsyncIDBKeyval<UserLogin[]>(STORAGE_KEY_USERS, defaultUsers, { deep: true }, users)
    }

    return {
      provide: {
        notifyCredentialsChanged,
      },
    }
  },
})
