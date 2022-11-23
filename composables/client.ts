import { login } from 'masto'
import { currentUser } from './users'
import { DEFAULT_SERVER } from '~/constants'

// TODO: improve upsteam to make this synchronous (delayed auth)
export const masto = await login({
  url: `https://${currentUser.value?.server || DEFAULT_SERVER}`,
  accessToken: currentUser.value?.token || undefined,
})
