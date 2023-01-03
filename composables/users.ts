import { login as loginMasto } from 'masto'
import type { Account, AccountCredentials, Instance, MastoClient, WsEvents } from 'masto'
import type { Ref } from 'vue'
import type { RemovableRef } from '@vueuse/core'
import type { ElkMasto, UserLogin } from '~/types'
import {
  DEFAULT_POST_CHARS_LIMIT,
  DEFAULT_SERVER,
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
const instances = useLocalStorage<Record<string, Instance>>(STORAGE_KEY_SERVERS, mock ? mock.server : {}, { deep: true })
const currentUserId = useLocalStorage<string>(STORAGE_KEY_CURRENT_USER, mock ? mock.user.account.id : '')

export const currentUser = computed<UserLogin | undefined>(() => {
  if (!currentUserId.value)
    // Fallback to the first account
    return users.value[0]

  const user = users.value.find(user => user.account?.id === currentUserId.value)
  if (user)
    return user
})

export const isGuest = computed(
  () => currentUserId.value.startsWith('[anonymous]@') || !currentUser.value?.account?.acct,
)

export const currentServer = computed<string>(() => currentUser.value?.server || DEFAULT_SERVER)
export const currentInstance = computed<null | Instance>(() => {
  return instances.value[currentServer.value] ?? null
})

export const currentUserHandle = computed(() =>
  isGuest.value ? '[anonymous]' : currentUser.value!.account!.acct
  ,
)

export const useUsers = () => users

export const characterLimit = computed(() => currentInstance.value?.configuration.statuses.maxCharacters ?? DEFAULT_POST_CHARS_LIMIT)

async function loginTo(user?: UserLogin) {
  const route = useRoute()
  const router = useRouter()
  const server = user?.server || (route.params.server as string)
  const masto = await loginMasto({
    url: `https://${server}`,
    accessToken: user?.token,
    disableVersionCheck: true,
    // Suppress warning of `masto/fetch` usage
    disableExperimentalWarning: true,
  })

  if (!user?.token) {
    const instance = await masto.instances.fetch()

    currentUserId.value = `[anonymous]@${server}`
    instances.value[server] = instance
    users.value.push({ server, guest: true })
  }

  else {
    try {
      const [me, instance, pushSubscription] = await Promise.all([
        masto.accounts.verifyCredentials(),
        masto.instances.fetch(),
        // if PWA is not enabled, don't get push subscription
        useRuntimeConfig().public.pwaEnabled
          // we get 404 response instead empty data
          ? masto.pushSubscriptions.fetch().catch(() => Promise.resolve(undefined))
          : Promise.resolve(undefined),
      ])

      if (!me.acct.includes('@'))
        me.acct = `${me.acct}@${instance.uri}`

      user.account = me
      user.pushSubscription = pushSubscription
      currentUserId.value = me.id
      instances.value[server] = instance

      if (!users.value.some(u => u.server === user.server && u.token === user.token))
        users.value.push(user)
    }
    catch {
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

export function setAccountInfo(userId: string, account: AccountCredentials) {
  const index = getUsersIndexByUserId(userId)
  if (index === -1)
    return false

  users.value[index].account = account
  return true
}

export async function pullMyAccountInfo() {
  const account = await useMasto().accounts.verifyCredentials()
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
  const { acct } = user.account!
  // clear request notification permission
  delete useLocalStorage<PushNotificationRequest>(STORAGE_KEY_NOTIFICATION, {}).value[acct]
  // clear push notification policy
  delete useLocalStorage<PushNotificationPolicy>(STORAGE_KEY_NOTIFICATION_POLICY, {}).value[acct]

  const pwaEnabled = useRuntimeConfig().public.pwaEnabled

  // we remove the sw push manager if required and there are no more accounts with subscriptions
  if (pwaEnabled && fromSWPushManager && (users.value.length === 0 || users.value.every(u => !u.pushSubscription))) {
    // clear sw push subscription
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription)
        await subscription.unsubscribe()
    }
    catch {
      // juts ignore
    }
  }
}

export async function removePushNotifications(user: UserLogin) {
  if (!user.pushSubscription)
    return

  // unsubscribe push notifications
  try {
    await useMasto().pushSubscriptions.remove()
  }
  catch {
    // ignore
  }
}

export async function signout() {
  // TODO: confirm
  if (!currentUser.value)
    return

  const masto = useMasto()

  const _currentUserId = currentUser.value.account!.id

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

const notifications = reactive<Record<string, undefined | [Promise<WsEvents>, number]>>({})

export const useNotifications = () => {
  const id = currentUser.value?.account!.id
  const masto = useMasto()

  const clearNotifications = () => {
    if (!id || !notifications[id])
      return
    notifications[id]![1] = 0
  }

  async function connect(): Promise<void> {
    if (!isMastoInitialised.value || !id || notifications[id] || !currentUser.value?.token)
      return

    const stream = masto.stream.streamUser()
    notifications[id] = [stream, 0]
    ;(await stream).on('notification', () => {
      if (notifications[id])
        notifications[id]![1]++
    })
  }

  function disconnect(): void {
    if (!id || !notifications[id])
      return
    notifications[id]![0].then(stream => stream.disconnect())
    notifications[id] = undefined
  }

  watch(currentUser, disconnect)
  connect()

  return {
    notifications: computed(() => id ? notifications[id]?.[1] ?? 0 : 0),
    disconnect,
    clearNotifications,
  }
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
  // @ts-expect-error bind value to the function
  const storages = useUserLocalStorage._ = useUserLocalStorage._ || new Map<string, Ref<Record<string, any>>>()

  if (!storages.has(key))
    storages.set(key, useLocalStorage(key, {}, { deep: true }))
  const all = storages.get(key) as Ref<Record<string, T>>

  return computed(() => {
    const id = isGuest.value
      ? '[anonymous]'
      : currentUser.value!.account!.acct
    all.value[id] = Object.assign(initial(), all.value[id] || {})
    return all.value[id]
  })
}

/**
 * Clear all storages for the given account
 */
export function clearUserLocalStorage(account?: Account) {
  if (!account)
    account = currentUser.value?.account
  if (!account)
    return

  const id = `${account.acct}@${currentInstance.value?.uri || currentServer.value}`
  // @ts-expect-error bind value to the function
  ;(useUserLocalStorage._ as Map<string, Ref<Record<string, any>>>).forEach((storage) => {
    if (storage.value[id])
      delete storage.value[id]
  })
}

export const createMasto = () => {
  const api = shallowRef<MastoClient | null>(null)
  const apiPromise = ref<Promise<MastoClient> | null>(null)
  const initialised = computed(() => !!api.value)

  const masto = new Proxy({} as ElkMasto, {
    get(_, key: keyof ElkMasto) {
      if (key === 'loggedIn')
        return initialised

      if (key === 'loginTo') {
        return (...args: any[]): Promise<MastoClient> => {
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
        return api.value[key as keyof MastoClient]

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
