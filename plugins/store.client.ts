import { login as loginMasto } from 'masto'
import type { UserLogin } from '~/types'

function createStore() {
  const { server, token } = useAppCookies()
  const accounts = useLocalStorage<UserLogin[]>('nuxtodon-accounts', [], { deep: true })
  const currentIndex = useLocalStorage<number>('nuxtodon-current-user', -1)
  const currentUser = computed<UserLogin | undefined>(() => accounts.value[currentIndex.value])

  async function login(user: UserLogin) {
    const existing = accounts.value.findIndex(u => u.server === user.server && u.token === user.token)
    if (existing !== -1) {
      if (currentIndex.value === existing)
        return null
      currentIndex.value = existing
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
    currentIndex.value = accounts.value.length
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
