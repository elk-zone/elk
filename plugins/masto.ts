import { login } from 'masto'
import { currentUser } from '../composables/users'
import { DEFAULT_SERVER } from '~/constants'

export default defineNuxtPlugin(async () => {
  try {
    // TODO: improve upstream to make this synchronous (delayed auth)
    const masto = await login({
      url: `https://${currentUser.value?.server || DEFAULT_SERVER}`,
      accessToken: currentUser.value?.token || undefined,
    })

    return {
      provide: {
        masto,
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
