// Temporary hotfix of https://github.com/unjs/unstorage/blob/4d637a117667ae638a6cac657aac139d88a78027/src/drivers/cloudflare-kv-http.ts#L6

import { $fetch } from 'ofetch'
import { defineDriver } from 'unstorage'

const LOG_TAG = '[unstorage] [cloudflare-http] '

interface KVAuthAPIToken {
  /**
   * API Token generated from the [User Profile 'API Tokens' page](https://dash.cloudflare.com/profile/api-tokens)
   * of the Cloudflare console.
   * @see https://api.cloudflare.com/#getting-started-requests
   */
  apiToken: string
}

interface KVAuthServiceKey {
  /**
   * A special Cloudflare API key good for a restricted set of endpoints.
   * Always begins with "v1.0-", may vary in length.
   * May be used to authenticate in place of `apiToken` or `apiKey` and `email`.
   * @see https://api.cloudflare.com/#getting-started-requests
   */
  userServiceKey: string
}

interface KVAuthEmailKey {
  /**
   * Email address associated with your account.
   * Should be used along with `apiKey` to authenticate in place of `apiToken`.
   */
  email: string
  /**
   * API key generated on the "My Account" page of the Cloudflare console.
   * Should be used along with `email` to authenticate in place of `apiToken`.
   * @see https://api.cloudflare.com/#getting-started-requests
   */
  apiKey: string
}

export type KVHTTPOptions = {
  /**
   * Cloudflare account ID (required)
   */
  accountId: string
  /**
   * The ID of the KV namespace to target (required)
   */
  namespaceId: string
  /**
   * The URL of the Cloudflare API.
   * @default https://api.cloudflare.com
   */
  apiURL?: string
} & (KVAuthServiceKey | KVAuthAPIToken | KVAuthEmailKey)

type CloudflareAuthorizationHeaders = {
  'X-Auth-Email': string
  'X-Auth-Key': string
  'X-Auth-User-Service-Key'?: string
  Authorization?: `Bearer ${string}`
} | {
  'X-Auth-Email'?: string
  'X-Auth-Key'?: string
  'X-Auth-User-Service-Key': string
  Authorization?: `Bearer ${string}`
} | {
  'X-Auth-Email'?: string
  'X-Auth-Key'?: string
  'X-Auth-User-Service-Key'?: string
  Authorization: `Bearer ${string}`
}

export default defineDriver<KVHTTPOptions>((opts) => {
  if (!opts)
    throw new Error('Options must be provided.')

  if (!opts.accountId)
    throw new Error(`${LOG_TAG}\`accountId\` is required.`)

  if (!opts.namespaceId)
    throw new Error(`${LOG_TAG}\`namespaceId\` is required.`)

  let headers: CloudflareAuthorizationHeaders

  if ('apiToken' in opts) {
    headers = { Authorization: `Bearer ${opts.apiToken}` }
  }
  else if ('userServiceKey' in opts) {
    headers = { 'X-Auth-User-Service-Key': opts.userServiceKey }
  }
  else if (opts.email && opts.apiKey) {
    headers = { 'X-Auth-Email': opts.email, 'X-Auth-Key': opts.apiKey }
  }
  else {
    throw new Error(
      `${LOG_TAG}One of the \`apiToken\`, \`userServiceKey\`, or a combination of \`email\` and \`apiKey\` is required.`,
    )
  }

  const apiURL = opts.apiURL || 'https://api.cloudflare.com'
  const baseURL = `${apiURL}/client/v4/accounts/${opts.accountId}/storage/kv/namespaces/${opts.namespaceId}`
  const kvFetch = $fetch.create({ baseURL, headers })

  const hasItem = async (key: string) => {
    try {
      const res = await kvFetch(`/metadata/${key}`)
      return res?.success === true
    }
    catch (err: any) {
      if (!err.response)
        throw err
      if (err.response.status === 404)
        return false
      throw err
    }
  }

  const getItem = async (key: string) => {
    try {
      // Cloudflare API returns with `content-type: application/octet-stream`
      return await kvFetch(`/values/${key}`).then(r => r.text())
    }
    catch (err: any) {
      if (!err.response)
        throw err
      if (err.response.status === 404)
        return null
      throw err
    }
  }

  const setItem = async (key: string, value: any) => {
    return await kvFetch(`/values/${key}`, { method: 'PUT', body: value })
  }

  const removeItem = async (key: string) => {
    return await kvFetch(`/values/${key}`, { method: 'DELETE' })
  }

  const getKeys = async (base?: string) => {
    const keys: string[] = []

    const params = new URLSearchParams()
    if (base)
      params.set('prefix', base)

    const firstPage = await kvFetch('/keys', { params })
    firstPage.result.forEach(({ name }: { name: string }) => keys.push(name))

    const cursor = firstPage.result_info.cursor
    if (cursor)
      params.set('cursor', cursor)

    while (params.has('cursor')) {
      const pageResult = await kvFetch('/keys', { params: Object.fromEntries(params.entries()) })
      pageResult.result.forEach(({ name }: { name: string }) => keys.push(name))
      const pageCursor = pageResult.result_info.cursor
      if (pageCursor)
        params.set('cursor', pageCursor)

      else
        params.delete('cursor')
    }
    return keys
  }

  const clear = async () => {
    const keys: string[] = await getKeys()
    // Split into chunks of 10000, as the API only allows for 10,000 keys at a time
    const chunks = keys.reduce((acc, key, i) => {
      if (i % 10000 === 0)
        acc.push([])
      acc[acc.length - 1].push(key)
      return acc
    }, [[]] as string[][])
    // Call bulk delete endpoint with each chunk
    await Promise.all(chunks.map((chunk) => {
      return kvFetch('/bulk', {
        method: 'DELETE',
        body: { keys: chunk },
      })
    }))
  }

  return {
    hasItem,
    getItem,
    setItem,
    removeItem,
    getKeys,
    clear,
  }
})
