import type { MastoClient } from 'masto'
import { currentUser } from '../composables/users'

export default defineNuxtPlugin(async () => {
  let masto!: MastoClient
  try {
    const { query } = useRoute()
    const user = typeof query.server === 'string' && typeof query.token === 'string'
      ? {
          server: query.server,
          token: query.token,
          vapidKey: typeof query.vapid_key === 'string' ? query.vapid_key : undefined,
        }
      : currentUser.value

    // TODO: improve upstream to make this synchronous (delayed auth)
    masto = await loginTo(user)
  }
  catch {
    // Show error page when Mastodon server is down
    showError({
      fatal: true,
      statusMessage: 'Could not log into account.',
    })
  }

  return {
    provide: {
      masto: shallowReactive({
        replace(api: MastoClient) { this.api = api },
        api: masto,
      }),
    },
  }
})
