import { login as loginMasto } from 'masto'
import type { AccountCredentials, Instance } from 'masto'
import type { UserLogin } from '~/types'
import { DEFAULT_POST_CHARS_LIMIT, DEFAULT_SERVER, STORAGE_KEY_CURRENT_USER, STORAGE_KEY_SERVER, STORAGE_KEY_USERS } from '~/constants'

const users = useLocalStorage<UserLogin[]>(STORAGE_KEY_USERS, [], { deep: true })
const currentUserId = useLocalStorage<string>(STORAGE_KEY_CURRENT_USER, '')

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

export const currentInstance = useLocalStorage<Partial<Instance>>(STORAGE_KEY_SERVER, {}, { deep: true })

export const characterLimit = computed(() => currentInstance.value.configuration?.statuses.maxCharacters ?? DEFAULT_POST_CHARS_LIMIT)

export async function loginTo(user: UserLogin & { account?: AccountCredentials }) {
  const existing = users.value.findIndex(u => u.server === user.server && u.token === user.token)
  if (existing !== -1) {
    if (currentUserId.value === users.value[existing].account?.id)
      return null
    currentUserId.value = user.account?.id
    await reloadPage()
    return true
  }

  const masto = await loginMasto({
    url: `https://${user.server}`,
    accessToken: user.token,
  })
  const me = await masto.accounts.verifyCredentials()
  user.account = me
  currentInstance.value = await masto.instances.fetch()

  users.value.push(user)
  currentUserId.value = me.id
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
