import { createClient, fetchV1Instance } from 'masto'
import type { mastodon } from 'masto'
import type { Ref } from 'vue'
import type { MaybeComputedRef, RemovableRef } from '@vueuse/core'
import type { ElkMasto, UserLogin } from '~/types'
import {
  DEFAULT_POST_CHARS_LIMIT,
  STORAGE_KEY_CURRENT_USER,
  STORAGE_KEY_NOTIFICATION,
  STORAGE_KEY_NOTIFICATION_POLICY,
  STORAGE_KEY_SERVERS,
  STORAGE_KEY_USERS,
} from '~/constants'
import type { PushNotificationPolicy, PushNotificationRequest } from '~/composables/push-notifications/types'
import { useAsyncIDBKeyval } from '~/composables/idb'

const mock = process.mock

const initializeUsers = async (): Promise<Ref<UserLogin[]> | RemovableRef<UserLogin[]>> => {
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

  const users = process.server
    ? ref<UserLogin[]>(defaultUsers)
    : await useAsyncIDBKeyval<UserLogin[]>(STORAGE_KEY_USERS, defaultUsers, { deep: true })

  if (removeUsersOnLocalStorage)
    globalThis.localStorage.removeItem(STORAGE_KEY_USERS)

  return users
}

const users = await initializeUsers()
const instances = useLocalStorage<Record<string, mastodon.v1.Instance>>(STORAGE_KEY_SERVERS, mock ? mock.server : {}, { deep: true })
const currentUserId = useLocalStorage<string>(STORAGE_KEY_CURRENT_USER, mock ? mock.user.account.id : '')

export const currentUser = computed<UserLogin | undefined>(() => {
  if (currentUserId.value) {
    const user = users.value.find(user => user.account?.id === currentUserId.value)
    if (user)
      return user
  }
  // Fallback to the first account
  return users.value[0]
})

const publicInstance = ref<mastodon.v1.Instance | null>(null)
export const currentInstance = computed<null | mastodon.v1.Instance>(() => currentUser.value ? instances.value[currentUser.value.server] ?? null : publicInstance.value)
export const isGlitchEdition = computed(() => currentInstance.value?.version.includes('+glitch'))

export const publicServer = ref('')
export const currentServer = computed<string>(() => currentUser.value?.server || publicServer.value)

// when multiple tabs: we need to reload window when sign in, switch account or sign out
if (process.client) {
  const windowReload = () => {
    document.visibilityState === 'visible' && window.location.reload()
  }
  watch(currentUserId, async (id, oldId) => {
    // when sign in or switch account
    if (id) {
      if (id === currentUser.value?.account?.id) {
        // when sign in, the other tab will not have the user, idb is not reactive
        const newUser = users.value.find(user => user.account?.id === id)
        // if the user is there, then we are switching account
        if (newUser) {
          // check if the change is on current tab: if so, don't reload
          if (document.hasFocus() || document.visibilityState === 'visible')
            return
        }
      }

      window.addEventListener('visibilitychange', windowReload, { capture: true })
    }
    // when sign out
    else if (oldId) {
      const oldUser = users.value.find(user => user.account?.id === oldId)
      // when sign out, the other tab will not have the user, idb is not reactive
      if (oldUser)
        window.addEventListener('visibilitychange', windowReload, { capture: true })
    }
  }, { immediate: true, flush: 'post' })
}

export const currentUserHandle = computed(() => currentUser.value?.account.id
  ? `${currentUser.value.account.acct}@${currentInstance.value?.uri || currentServer.value}`
  : '[anonymous]',
)

export const useUsers = () => users
export const useSelfAccount = (user: MaybeComputedRef<mastodon.v1.Account | undefined>) =>
  computed(() => currentUser.value && resolveUnref(user)?.id === currentUser.value.account.id)

export const characterLimit = computed(() => currentInstance.value?.configuration.statuses.maxCharacters ?? DEFAULT_POST_CHARS_LIMIT)

async function loginTo(user?: Omit<UserLogin, 'account'> & { account?: mastodon.v1.AccountCredentials }) {
  const route = useRoute()
  const router = useRouter()
  const server = user?.server || route.params.server as string || publicServer.value
  const url = `https://${server}`
  const instance = await fetchV1Instance({
    url,
  })
  const masto = createClient({
    url,
    streamingApiUrl: instance.urls.streamingApi,
    accessToken: user?.token,
    disableVersionCheck: true,
  })

  if (!user?.token) {
    publicServer.value = server
    publicInstance.value = instance
  }

  else {
    try {
      const [me, pushSubscription] = await Promise.all([
        masto.v1.accounts.verifyCredentials(),
        // if PWA is not enabled, don't get push subscription
        useRuntimeConfig().public.pwaEnabled
          // we get 404 response instead empty data
          ? masto.v1.webPushSubscriptions.fetch().catch(() => Promise.resolve(undefined))
          : Promise.resolve(undefined),
      ])

      if (!me.acct.includes('@'))
        me.acct = `${me.acct}@${instance.uri}`

      user.account = me
      user.pushSubscription = pushSubscription
      currentUserId.value = me.id
      instances.value[server] = instance

      if (!users.value.some(u => u.server === user.server && u.token === user.token))
        users.value.push(user as UserLogin)
    }
    catch (err) {
      console.error(err)
      await signout()
    }
  }

  // This only cleans up the URL; page content should stay the same
  if (route.path === '/signin/callback') {
    await router.push('/home')
  }

  else if ('server' in route.params && user?.token && !useNuxtApp()._processingMiddleware) {
    await router.push({
      ...route,
      force: true,
    })
  }

  return masto
}

export function setAccountInfo(userId: string, account: mastodon.v1.AccountCredentials) {
  const index = getUsersIndexByUserId(userId)
  if (index === -1)
    return false

  users.value[index].account = account
  return true
}

export async function pullMyAccountInfo() {
  const account = await useMasto().v1.accounts.verifyCredentials()
  if (!account.acct.includes('@'))
    account.acct = `${account.acct}@${currentInstance.value!.uri}`

  setAccountInfo(currentUserId.value, account)
  cacheAccount(account, currentServer.value, true)
}

export function getUsersIndexByUserId(userId: string) {
  return users.value.findIndex(u => u.account?.id === userId)
}

export async function removePushNotificationData(user: UserLogin, fromSWPushManager = true) {
  // clear push subscription
  user.pushSubscription = undefined
  const { acct } = user.account
  // clear request notification permission
  delete useLocalStorage<PushNotificationRequest>(STORAGE_KEY_NOTIFICATION, {}).value[acct]
  // clear push notification policy
  delete useLocalStorage<PushNotificationPolicy>(STORAGE_KEY_NOTIFICATION_POLICY, {}).value[acct]

  const pwaEnabled = useRuntimeConfig().public.pwaEnabled
  const pwa = useNuxtApp().$pwa
  const registrationError = pwa?.registrationError === true
  const unregister = pwaEnabled && !registrationError && pwa?.registrationError === true && fromSWPushManager

  // we remove the sw push manager if required and there are no more accounts with subscriptions
  if (unregister && (users.value.length === 0 || users.value.every(u => !u.pushSubscription))) {
    // clear sw push subscription
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription)
        await subscription.unsubscribe()
    }
    catch {
      // just ignore
    }
  }
}

export async function removePushNotifications(user: UserLogin) {
  if (!user.pushSubscription)
    return

  // unsubscribe push notifications
  await useMasto().v1.webPushSubscriptions.remove().catch(() => Promise.resolve())
}

export async function signout() {
  // TODO: confirm
  if (!currentUser.value)
    return

  const masto = useMasto()

  const _currentUserId = currentUser.value.account.id

  const index = users.value.findIndex(u => u.account?.id === _currentUserId)

  if (index !== -1) {
    // Clear stale data
    clearUserLocalStorage()
    if (!users.value.some((u, i) => u.server === currentUser.value!.server && i !== index))
      delete instances.value[currentUser.value.server]

    await removePushNotifications(currentUser.value)

    await removePushNotificationData(currentUser.value)

    currentUserId.value = ''
    // Remove the current user from the users
    users.value.splice(index, 1)
  }

  // Set currentUserId to next user if available
  currentUserId.value = users.value[0]?.account?.id

  if (!currentUserId.value)
    await useRouter().push('/')

  await masto.loginTo(currentUser.value)
}

export function checkLogin() {
  if (!currentUser.value) {
    openSigninDialog()
    return false
  }
  return true
}

/**
 * Create reactive storage for the current user
 */
export function useUserLocalStorage<T extends object>(key: string, initial: () => T) {
  const all = useLocalStorage<Record<string, T>>(key, {}, { deep: true })
  return computed(() => {
    const id = currentUser.value?.account.id
      ? currentUser.value.account.acct
      : '[anonymous]'
    all.value[id] = Object.assign(initial(), all.value[id] || {})
    return all.value[id]
  })
}

/**
 * Clear all storages for the given account
 */
export function clearUserLocalStorage(account?: mastodon.v1.Account) {
  if (!account)
    account = currentUser.value?.account
  if (!account)
    return

  const id = `${account.acct}@${currentInstance.value?.uri || currentServer.value}`
  // @ts-expect-error bind value to the function
  ;(useUserLocalStorage._ as Map<string, Ref<Record<string, any>>> | undefined)?.forEach((storage) => {
    if (storage.value[id])
      delete storage.value[id]
  })
}

export const createMasto = () => {
  const api = shallowRef<mastodon.Client | null>(null)
  const apiPromise = ref<Promise<mastodon.Client> | null>(null)
  const initialised = computed(() => !!api.value)

  const masto = new Proxy({} as ElkMasto, {
    get(_, key: keyof ElkMasto) {
      if (key === 'loggedIn')
        return initialised

      if (key === 'loginTo') {
        return (...args: any[]): Promise<mastodon.Client> => {
          return apiPromise.value = loginTo(...args).then((r) => {
            api.value = r
            return masto
          }).catch(() => {
            // Show error page when Mastodon server is down
            throw createError({
              fatal: true,
              statusMessage: 'Could not log into account.',
            })
          })
        }
      }

      if (api.value && key in api.value)
        return api.value[key as keyof mastodon.Client]

      if (!api.value) {
        return new Proxy({}, {
          get(_, subkey) {
            if (typeof subkey === 'string' && subkey.startsWith('iterate')) {
              return (...args: any[]) => {
                let paginator: any
                function next() {
                  paginator = paginator || (api.value as any)?.[key][subkey](...args)
                  return paginator.next()
                }
                return { next }
              }
            }

            return (...args: any[]) => apiPromise.value?.then((r: any) => r[key][subkey](...args))
          },
        })
      }

      return undefined
    },
  })

  return masto
}
