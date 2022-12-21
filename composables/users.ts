import { login as loginMasto } from 'masto'
import type { Account, AccountCredentials, Instance, MastoClient, WsEvents } from 'masto'
import type { Ref } from 'vue'
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

const mock = process.mock
const users = useLocalStorage<UserLogin[]>(STORAGE_KEY_USERS, mock ? [mock.user] : [], { deep: true })
const instances = useLocalStorage<Record<string, Instance>>(STORAGE_KEY_SERVERS, mock ? mock.server : {}, { deep: true })
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

const publicInstance = ref<Instance | null>(null)
export const currentInstance = computed<null | Instance>(() => currentUser.value ? instances.value[currentUser.value.server] ?? null : publicInstance.value)

export const publicServer = ref(DEFAULT_SERVER)
export const currentServer = computed<string>(() => currentUser.value?.server || publicServer.value)

export const currentUserHandle = computed(() => currentUser.value?.account.id
  ? `${currentUser.value.account.acct}@${currentInstance.value?.uri || currentServer.value}`
  : '[anonymous]',
)

export const useUsers = () => users

export const characterLimit = computed(() => currentInstance.value?.configuration.statuses.maxCharacters ?? DEFAULT_POST_CHARS_LIMIT)

async function loginTo(user?: Omit<UserLogin, 'account'> & { account?: AccountCredentials }) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const router = useRouter()
  const server = user?.server || route.params.server as string || publicServer.value
  const masto = await loginMasto({
    url: `https://${server}`,
    accessToken: user?.token,
    disableVersionCheck: !!config.public.disableVersionCheck,
    // Suppress warning of `masto/fetch` usage
    disableExperimentalWarning: true,
  })

  if (!user?.token) {
    publicServer.value = server
    publicInstance.value = await masto.instances.fetch()
  }

  else {
    try {
      const [me, instance, pushSubscription] = await Promise.all([
        masto.accounts.verifyCredentials(),
        masto.instances.fetch(),
        // we get 404 response instead empty data
        masto.pushSubscriptions.fetch().catch(() => Promise.resolve(undefined)),
      ])

      user.account = me
      user.pushSubscription = pushSubscription
      currentUserId.value = me.id
      instances.value[server] = instance

      if (!user.account.acct.includes('@'))
        user.account.acct = `${user.account.acct}@${instance.uri}`

      if (!users.value.some(u => u.server === user.server && u.token === user.token))
        users.value.push(user as UserLogin)
    }
    catch {
      await signout()
    }
  }

  if ('server' in route.params && user?.token && !useNuxtApp()._processingMiddleware) {
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
  const me = await useMasto().accounts.verifyCredentials()
  setAccountInfo(currentUserId.value, me)
}

export function getUsersIndexByUserId(userId: string) {
  return users.value.findIndex(u => u.account?.id === userId)
}

export async function removePushNotifications(user: UserLogin, fromSWPushManager = true) {
  if (!useRuntimeConfig().public.pwaEnabled || !user.pushSubscription)
    return

  // unsubscribe push notifications
  try {
    await useMasto().pushSubscriptions.remove()
  }
  catch {
    // ignore
  }
  // clear push subscription
  user.pushSubscription = undefined
  const { acct } = user.account
  // clear request notification permission
  delete useLocalStorage<PushNotificationRequest>(STORAGE_KEY_NOTIFICATION, {}).value[acct]
  // clear push notification policy
  delete useLocalStorage<PushNotificationPolicy>(STORAGE_KEY_NOTIFICATION_POLICY, {}).value[acct]

  // we remove the sw push manager if required and there are no more accounts with subscriptions
  if (fromSWPushManager && (users.value.length === 0 || users.value.every(u => !u.pushSubscription))) {
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
  const id = currentUser.value?.account.id
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
    const id = currentUser.value?.account.id
      ? `${currentUser.value.account.acct}@${currentInstance.value?.uri || currentServer.value}`
      : '[anonymous]'
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
            return (...args: any[]) => apiPromise.value?.then((r: any) => r[key][subkey](...args))
          },
        })
      }

      return undefined
    },
  })

  return masto
}
