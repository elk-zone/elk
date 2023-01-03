export default defineNuxtPlugin(async (nuxtApp) => {
  const masto = createMasto()

  if (process.client) {
    const { query } = useRoute()
    const user = typeof query.server === 'string' && typeof query.token === 'string'
      ? {
          server: query.server,
          token: query.token,
          vapidKey: typeof query.vapid_key === 'string' ? query.vapid_key : undefined,
          guest: false,
        }
      : currentUser.value

    nuxtApp.hook('app:suspense:resolve', () => {
      // TODO: improve upstream to make this synchronous (delayed auth)
      if (!masto.loggedIn.value)
        masto.loginTo(user)
    })
  }

  return {
    provide: {
      masto,
    },
  }
})
