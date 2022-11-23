import { login as loginMasto } from 'masto'
import type { UserLogin } from '~/types'
import { DEFAULT_SERVER } from '~/constants'

const accounts = useLocalStorage<UserLogin[]>('nuxtodon-accounts', [], { deep: true })
const currentId = useLocalStorage<string>('nuxtodon-current-user', '')

export const currentUser = computed<UserLogin | undefined>(() => {
  let user: UserLogin | undefined
  if (currentId.value) {
    user = accounts.value.find(user => user.account?.id === currentId.value)
    if (user)
      return user
  }
  // Fallback to the first account
  return accounts.value[0]
})

export const currentServer = computed<string>(() => currentUser.value?.server || DEFAULT_SERVER)

export const useAccounts = () => accounts

export async function loginTo(user: UserLogin) {
  const existing = accounts.value.findIndex(u => u.server === user.server && u.token === user.token)
  if (existing !== -1) {
    if (currentId.value === accounts.value[existing].account?.id)
      return null
    currentId.value = user.account?.id
    return true
  }

  const masto = await loginMasto({
    url: `https://${user.server}`,
    accessToken: user.token,
  })
  const me = await masto.accounts.verifyCredentials()
  user.account = me

  accounts.value.push(user)
  currentId.value = me.id
  return true
}
