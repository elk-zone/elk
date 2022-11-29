import { login as loginMasto } from 'masto'
import type { AccountCredentials, Instance } from 'masto'
import { clearUserDrafts } from './statusDrafts'
import type { UserLogin } from '~/types'
import { DEFAULT_POST_CHARS_LIMIT, DEFAULT_SERVER, STORAGE_KEY_CURRENT_USER, STORAGE_KEY_SERVERS, STORAGE_KEY_USERS } from '~/constants'

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
export const currentServer = computed<string>(() => currentUser.value?.server || publicServer.value)

export const useUsers = () => users

export const currentInstance = computed<null | Instance>(() => currentUserId.value ? servers.value[currentUserId.value] ?? null : null)

export const characterLimit = computed(() => currentInstance.value?.configuration.statuses.maxCharacters ?? DEFAULT_POST_CHARS_LIMIT)

export async function loginTo(user?: Omit<UserLogin, 'account'> & { account?: AccountCredentials }) {
  if (user) {
    const existing = users.value.find(u => u.server === user.server && u.token === user.token)
    if (existing && currentUserId.value !== user.account?.id)
      currentUserId.value = user.account?.id
  }

  const masto = await loginMasto({
    url: `https://${user?.server || DEFAULT_SERVER}`,
    accessToken: user?.token,
  })

  if (!user?.token) {
    publicServer.value = user?.server || DEFAULT_SERVER
  }

  else {
    try {
      const me = await masto.accounts.verifyCredentials()
      user.account = me

      if (!users.value.some(u => u.server === user.server && u.token === user.token))
        users.value.push(user as UserLogin)

      currentUserId.value = me.id
      servers.value[me.id] = await masto.instances.fetch()
    }
    catch {
      await signout()
    }
  }

  setMasto(masto)

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
    await useRouter().push('/public')

  await loginTo(currentUser.value)
}
