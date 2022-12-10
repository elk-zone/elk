import { login as loginMasto } from 'masto'
import type { AccountCredentials, Instance, WsEvents } from 'masto'
import type { RouteLocation } from 'vue-router'
import { clearUserDrafts } from './statusDrafts'
import type { ElkAccountCredentials, UserLogin } from '~/types'
import { DEFAULT_POST_CHARS_LIMIT, DEFAULT_SERVER, STORAGE_KEY_CURRENT_USER, STORAGE_KEY_SERVERS, STORAGE_KEY_USERS } from '~/constants'
import { cacheAccount } from '~/composables/cache'

const mock = process.mock
const users = useLocalStorage<UserLogin[]>(STORAGE_KEY_USERS, mock ? [mock.user] : [], { deep: true })
const servers = useLocalStorage<Record<string, Instance>>(STORAGE_KEY_SERVERS, mock ? mock.server : {}, { deep: true })
const currentUserId = useLocalStorage<string>(STORAGE_KEY_CURRENT_USER, mock ? mock.user.account.id : '')

export const currentUser = computed<UserLogin | undefined>(() => {
  let user: UserLogin | undefined
  if (currentUserId.value) {
    user = users.value.find(user => user.account?.id === currentUserId.value)
    if (user)
      return user
  }
  // Fallback to the first account
  return users.value[0]
})

export const publicServer = ref(DEFAULT_SERVER)
const publicInstance = ref<Instance | null>(null)
export const currentServer = computed<string>(() => currentUser.value?.server || publicServer.value)

export const useUsers = () => users

export const currentInstance = computed<null | Instance>(() => currentUserId.value ? servers.value[currentUserId.value] ?? null : publicInstance.value)

export const characterLimit = computed(() => currentInstance.value?.configuration.statuses.maxCharacters ?? DEFAULT_POST_CHARS_LIMIT)

export async function loginTo(user?: Omit<UserLogin, 'account'> & { account?: AccountCredentials }) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const router = useRouter()
  const server = user?.server || route.params.server as string || publicServer.value
  const masto = await loginMasto({
    url: `https://${server}`,
    accessToken: user?.token,
    disableVersionCheck: !!config.public.disableVersionCheck,
  })

  if (!user?.token) {
    publicServer.value = server
    publicInstance.value = await masto.instances.fetch()
  }

  else {
    try {
      const [me, server] = await Promise.all([
        masto.accounts.verifyCredentials(),
        masto.instances.fetch(),
      ])

      // we use the hostname for cache entry and server.uri for display server name:
      // for example, webtoo.ls (server.uri) and m.webtoo.ls (host)
      const host = new URL(me.url, import.meta.url).hostname

      const newMe: ElkAccountCredentials = {
        ...me,
        displayServerName: server.uri,
      }

      if (!newMe.acct.includes('@'))
        newMe.acct = `${newMe.acct}@${host}`

      cacheAccount(newMe, true)

      user.account = newMe
      currentUserId.value = newMe.id
      servers.value[newMe.id] = server

      if (!users.value.some(u => u.server === user.server && u.token === user.token))
        users.value.push(user as UserLogin)
    }
    catch {
      await signout()
    }
  }

  setMasto(masto)

  if ('server' in route.params) {
    // if we're on the account index page we need to force to change the url
    const changeRoute: RouteLocation | undefined = user && user.account
      ? getAccountRoute(user.account)
      : undefined
    const path = changeRoute ? `${changeRoute.params!.server}/@${changeRoute.params!.account}` : undefined
    if (changeRoute && path !== route.fullPath) {
      await router.push({
        ...changeRoute,
        force: true,
      })
    }
    else {
      await router.push({
        ...route,
        force: true,
      })
    }
  }

  return masto
}

export async function signout() {
  // TODO: confirm
  if (!currentUser.value)
    return

  const _currentUserId = currentUser.value.account.id

  const index = users.value.findIndex(u => u.account?.id === _currentUserId)

  if (index !== -1) {
    // Clear stale data
    delete servers.value[_currentUserId]
    clearUserDrafts()
    clearUserFeatureFlags()

    currentUserId.value = ''
    // Remove the current user from the users
    users.value.splice(index, 1)
  }

  // Set currentUserId to next user if available
  currentUserId.value = users.value[0]?.account?.id

  if (!currentUserId.value)
    await useRouter().push(`/${currentServer.value}/public`)

  await loginTo(currentUser.value)
}

const notifications = reactive<Record<string, undefined | [Promise<WsEvents>, number]>>({})

export const useNotifications = () => {
  const id = currentUser.value?.account.id

  const clearNotifications = () => {
    if (!id || !notifications[id])
      return
    notifications[id]![1] = 0
  }

  async function connect(): Promise<void> {
    if (!id || notifications[id])
      return

    const masto = useMasto()
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

  return { notifications: computed(() => id ? notifications[id]?.[1] ?? 0 : 0), disconnect, clearNotifications }
}

export function checkLogin() {
  if (!currentUser.value) {
    openSigninDialog()
    return false
  }
  return true
}
