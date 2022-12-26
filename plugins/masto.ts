export default defineNuxtPlugin(async (nuxtApp) => {
  const masto = createMasto()

  if (process.client) {
    const { query, path } = useRoute()
    const router = useRouter()
    const user = typeof query.server === 'string' && typeof query.token === 'string'
      ? {
          server: query.server,
          token: query.token,
          vapidKey: typeof query.vapid_key === 'string' ? query.vapid_key : undefined,
        }
      : currentUser.value

    nuxtApp.hook('app:suspense:resolve', () => {
      // TODO: improve upstream to make this synchronous (delayed auth)
      if (!masto.loggedIn.value) {
        masto.loginTo(user).then(() => {
          // This only cleans up the URL; page content should stay the same
          if (path === '/signin/callback')
            router.push('/home')
        })
      }
    })
  }

  return {
    provide: {
      masto,
    },
  }
})
