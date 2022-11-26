import { login as loginMasto } from 'masto'
import type { AccountCredentials, Instance } from 'masto'
import type { UserLogin } from '~/types'
import { DEFAULT_POST_CHARS_LIMIT, DEFAULT_SERVER, STORAGE_KEY_CURRENT_USER, STORAGE_KEY_SERVERS, STORAGE_KEY_USERS } from '~/constants'

const users = useLocalStorage<UserLogin[]>(STORAGE_KEY_USERS, [], { deep: true })
const servers = useLocalStorage<Record<string, Instance>>(STORAGE_KEY_SERVERS, {}, { deep: true })
const currentUserId = useLocalStorage<string>(STORAGE_KEY_CURRENT_USER, '')
const online = useOnline()

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

export const currentServer = computed<string>(() => currentUser.value?.server || DEFAULT_SERVER)

export const useUsers = () => users

export const currentInstance = computed<null | Instance>(() => currentUserId.value ? servers.value[currentUserId.value] ?? null : null)

export const characterLimit = computed(() => currentInstance.value?.configuration.statuses.maxCharacters ?? DEFAULT_POST_CHARS_LIMIT)

export async function loginTo(user: UserLogin & { account?: AccountCredentials }) {
  const existing = users.value.find(u => u.server === user.server && u.token === user.token)
  if (existing) {
    if (currentUserId.value === existing.account?.id)
      return null
    currentUserId.value = user.account?.id
    online.value && await reloadPage()
    return online.value
  }

  if (!online.value)
    return false

  const masto = await loginMasto({
    url: `https://${user.server}`,
    accessToken: user.token,
  })
  const me = await useMasto().accounts.verifyCredentials()
  user.account = me

  users.value.push(user)
  currentUserId.value = me.id
  servers.value[me.id] = await useMasto().instances.fetch()
  await reloadPage()
  return true
}

export async function signout() {
  // TODO: confirm
  if (!currentUser.value)
    return

  const index = users.value.findIndex(u => u.account?.id === currentUser.value?.account.id)
  if (index === -1)
    return

  users.value.splice(index, 1)
  currentUserId.value = users.value[0]?.account?.id
  await reloadPage()
}

export async function reloadPage(path = '/') {
  await nextTick()
  location.pathname = path
}
