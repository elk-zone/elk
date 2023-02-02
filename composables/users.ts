import { withoutProtocol } from 'ufo'
import type { mastodon } from 'masto'
import type { EffectScope, Ref } from 'vue'
import type { MaybeComputedRef, RemovableRef } from '@vueuse/core'
import type { ElkMasto } from './masto/masto'
import type { UserLogin } from '~/types'
import type { Overwrite } from '~/types/utils'
import {
  DEFAULT_POST_CHARS_LIMIT,
  STORAGE_KEY_CURRENT_USER_HANDLE,
  STORAGE_KEY_NODES,
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
const nodes = useLocalStorage<Record<string, any>>(STORAGE_KEY_NODES, {}, { deep: true })
const currentUserHandle = useLocalStorage<string>(STORAGE_KEY_CURRENT_USER_HANDLE, mock ? mock.user.account.id : '')
export const instanceStorage = useLocalStorage<Record<string, mastodon.v1.Instance>>(STORAGE_KEY_SERVERS, mock ? mock.server : {}, { deep: true })

export type ElkInstance = Partial<mastodon.v1.Instance> & {
  uri: string
  /** support GoToSocial */
  accountDomain?: string | null
}
export const getInstanceCache = (server: string): mastodon.v1.Instance | undefined => instanceStorage.value[server]

export const currentUser = computed<UserLogin | undefined>(() => {
  if (currentUserHandle.value) {
    const user = users.value.find(user => user.account?.acct === currentUserHandle.value)
    if (user)
      return user
  }
  // Fallback to the first account
  return users.value[0]
})

const publicInstance = ref<ElkInstance | null>(null)
export const currentInstance = computed<null | ElkInstance>(() => currentUser.value ? instanceStorage.value[currentUser.value.server] ?? null : publicInstance.value)

export function getInstanceDomain(instance: ElkInstance) {
  return instance.accountDomain || withoutProtocol(instance.uri)
}

export const publicServer = ref('')
export const currentServer = computed<string>(() => currentUser.value?.server || publicServer.value)

export const currentNodeInfo = computed<null | Record<string, any>>(() => nodes.value[currentServer.value] || null)
export const isGotoSocial = computed(() => currentNodeInfo.value?.software?.name === 'gotosocial')
export const isGlitchEdition = computed(() => currentInstance.value?.version?.includes('+glitch'))

// when multiple tabs: we need to reload window when sign in, switch account or sign out
if (process.client) {
  const windowReload = () => {
    document.visibilityState === 'visible' && window.location.reload()
  }
  watch(currentUserHandle, async (handle, oldHandle) => {
    // when sign in or switch account
    if (handle) {
      if (handle === currentUser.value?.account?.acct) {
        // when sign in, the other tab will not have the user, idb is not reactive
        const newUser = users.value.find(user => user.account?.acct === handle)
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
    else if (oldHandle) {
      const oldUser = users.value.find(user => user.account?.acct === oldHandle)
      // when sign out, the other tab will not have the user, idb is not reactive
      if (oldUser)
        window.addEventListener('visibilitychange', windowReload, { capture: true })
    }
  }, { immediate: true, flush: 'post' })
}

export const useUsers = () => users
export const useSelfAccount = (user: MaybeComputedRef<mastodon.v1.Account | undefined>) =>
  computed(() => currentUser.value && resolveUnref(user)?.id === currentUser.value.account.id)

export const characterLimit = computed(() => currentInstance.value?.configuration?.statuses.maxCharacters ?? DEFAULT_POST_CHARS_LIMIT)

export async function loginTo(masto: ElkMasto, user: Overwrite<UserLogin, { account?: mastodon.v1.AccountCredentials }>) {
  const { client } = $(masto)
  const instance = mastoLogin(masto, user)

  // GoToSocial only API
  const url = `https://${user.server}`
  fetch(`${url}/nodeinfo/2.0`).then(r => r.json()).then((info) => {
    nodes.value[user.server] = info
  }).catch(() => undefined)

  if (!user?.token) {
    publicServer.value = user.server
    publicInstance.value = instance
    return
  }

  function getUser() {
    return users.value.find(u => u.server === user.server && u.token === user.token)
  }

  const account = getUser()?.account
  if (account)
    currentUserHandle.value = account.acct

  const [me, pushSubscription] = await Promise.all([
    fetchAccountInfo(client, user.server),
    // if PWA is not enabled, don't get push subscription
    useAppConfig().pwaEnabled
    // we get 404 response instead empty data
      ? client.v1.webPushSubscriptions.fetch().catch(() => Promise.resolve(undefined))
      : Promise.resolve(undefined),
  ])

  const existingUser = getUser()
  if (existingUser) {
    existingUser.account = me
    existingUser.pushSubscription = pushSubscription
  }
  else {
    users.value.push({
      ...user,
      account: me,
      pushSubscription,
    })
  }

  currentUserHandle.value = me.acct
}

export async function fetchAccountInfo(client: mastodon.Client, server: string) {
  const account = await client.v1.accounts.verifyCredentials()
  if (!account.acct.includes('@'))
    account.acct = `${account.acct}@${server}`
  cacheAccount(account, server, true)
  return account
}

export async function refreshAccountInfo() {
  const account = await fetchAccountInfo(useMastoClient(), currentServer.value)
  currentUser.value!.account = account
  return account
}

export async function removePushNotificationData(user: UserLogin, fromSWPushManager = true) {
  // clear push subscription
  user.pushSubscription = undefined
  const { acct } = user.account
  // clear request notification permission
  delete useLocalStorage<PushNotificationRequest>(STORAGE_KEY_NOTIFICATION, {}).value[acct]
  // clear push notification policy
  delete useLocalStorage<PushNotificationPolicy>(STORAGE_KEY_NOTIFICATION_POLICY, {}).value[acct]

  const pwaEnabled = useAppConfig().pwaEnabled
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
  await useMastoClient().v1.webPushSubscriptions.remove().catch(() => Promise.resolve())
}

export async function switchUser(user: UserLogin) {
  const masto = useMasto()

  await loginTo(masto, user)

  // This only cleans up the URL; page content should stay the same
  const route = useRoute()
  const router = useRouter()
  if ('server' in route.params && user?.token && !useNuxtApp()._processingMiddleware) {
    await router.push({
      ...route,
      force: true,
    })
  }
}

export async function signOut() {
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
      delete instanceStorage.value[currentUser.value.server]

    await removePushNotifications(currentUser.value)

    await removePushNotificationData(currentUser.value)

    currentUserHandle.value = ''
    // Remove the current user from the users
    users.value.splice(index, 1)
  }

  // Set currentUserId to next user if available
  currentUserHandle.value = users.value[0]?.account?.acct

  if (!currentUserHandle.value)
    await useRouter().push('/')

  loginTo(masto, currentUser.value)
}

export function checkLogin() {
  if (!currentUser.value) {
    openSigninDialog()
    return false
  }
  return true
}

interface UseUserLocalStorageCache {
  scope: EffectScope
  value: Ref<Record<string, any>>
}

/**
 * Create reactive storage for the current user
 */
export function useUserLocalStorage<T extends object>(key: string, initial: () => T): Ref<T> {
  if (process.server || process.test)
    return shallowRef(initial())

  // @ts-expect-error bind value to the function
  const map: Map<string, UseUserLocalStorageCache> = useUserLocalStorage._ = useUserLocalStorage._ || new Map()

  if (!map.has(key)) {
    const scope = effectScope(true)
    const value = scope.run(() => {
      const all = useLocalStorage<Record<string, T>>(key, {}, { deep: true })
      return computed(() => {
        const id = currentUser.value?.account.id
          ? currentUser.value.account.acct
          : '[anonymous]'
        all.value[id] = Object.assign(initial(), all.value[id] || {})
        return all.value[id]
      })
    })
    map.set(key, { scope, value: value! })
  }

  return map.get(key)!.value as Ref<T>
}

/**
 * Clear all storages for the given account
 */
export function clearUserLocalStorage(account?: mastodon.v1.Account) {
  if (!account)
    account = currentUser.value?.account
  if (!account)
    return

  const id = `${account.acct}@${currentInstance.value ? getInstanceDomain(currentInstance.value) : currentServer.value}`

  // @ts-expect-error bind value to the function
  const cacheMap = useUserLocalStorage._ as Map<string, UseUserLocalStorageCache> | undefined
  cacheMap?.forEach(({ value }) => {
    if (value.value[id])
      delete value.value[id]
  })
}
