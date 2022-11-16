import { login as loginMasto } from 'masto'
import type { UserLogin } from '~/types'

function createStore() {
  const { server, token } = useAppCookies()
  const accounts = useLocalStorage<UserLogin[]>('nuxtodon-accounts', [], { deep: true })
  const currentId = useLocalStorage<string>('nuxtodon-current-user', '')
  const currentUser = computed<UserLogin | undefined>(() => {
    let user: UserLogin | undefined
    if (currentId.value) {
      user = accounts.value.find(user => user.account?.id === currentId.value)
      if (user)
        return user
    }
    // Fallback to the first account
    return accounts.value[0]
  })

  async function login(user: UserLogin) {
    const existing = accounts.value.findIndex(u => u.server === user.server && u.token === user.token)
    if (existing !== -1) {
      if (currentId.value === accounts.value[existing].account?.id)
        return null
      currentId.value = user.account?.id
      server.value = user.server
      token.value = user.token
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
    server.value = user.server
    token.value = user.token
    return true
  }

  return {
    currentUser,
    accounts,
    login,
  }
}

export type AppStore = ReturnType<typeof createStore>

export default defineNuxtPlugin((nuxt) => {
  nuxt.vueApp.provide('app-store', createStore())
})
