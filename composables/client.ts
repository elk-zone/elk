import { Client } from '~/api-client'

const client = new Client({
  host: 'https://mas.to',
})

export function useClient() {
  return client
}
