import { login } from 'masto'
import { currentUser } from './users'
import { DEFAULT_SERVER } from '~/constants'

// TODO: improve upsteam to make this synchronous (delayed auth)
export const masto = await login({
  url: `https://${currentUser.value?.server || DEFAULT_SERVER}`,
  accessToken: currentUser.value?.token || undefined,
}).catch(() => Promise.resolve(null))
// TODO: allow work offline, the catch will return a null instance and we can catch it on the global error handler plugin
