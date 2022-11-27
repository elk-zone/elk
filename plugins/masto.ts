import { login } from 'masto'
import { currentUser } from '../composables/users'
import { DEFAULT_SERVER } from '~/constants'

export default defineNuxtPlugin(async () => {
  try {
    const accessToken = currentUser.value?.token

    // TODO: improve upstream to make this synchronous (delayed auth)
    const masto = await login({
      url: `https://${currentUser.value?.server || DEFAULT_SERVER}`,
      accessToken,
    })

    if (accessToken)
      masto.accounts.verifyCredentials().catch(() => signout())

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
