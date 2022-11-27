import type { MastoClient } from 'masto'
import { currentUser } from '../composables/users'

export default defineNuxtPlugin(async () => {
  try {
    const { query } = useRoute()
    const user = typeof query.server === 'string' && typeof query.token === 'string'
      ? { server: query.server, token: query.token }
      : currentUser.value

    // TODO: improve upstream to make this synchronous (delayed auth)
    const masto = await loginTo(user) as MastoClient

    return {
      provide: {
        masto: shallowReactive({
          replace(api: MastoClient) { this.api = api },
          api: masto,
        }),
      },
    }
  }
  catch {
    // TODO: handle error
    // Show error page when Mastodon server is down
    throw createError({
      fatal: true,
      statusMessage: 'Could not log into account.',
    })
  }
})
