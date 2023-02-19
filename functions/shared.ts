import type { KVNamespace } from '@cloudflare/workers-types'
import { APP_NAME } from '../constants/index'
import type { AppInfo } from '../types'

const KV_NAMESPACE_PREFIX = 'servers:v3:'

const generateKey = (origin: string, server: string) => {
  const originURL: URL = new URL(origin)
  const host = originURL.hostname.replace(/[^\w\d]/g, '-')
  return `${KV_NAMESPACE_PREFIX}${server}:${host}.json`.toLowerCase()
}

interface Token {
  access_token: string
  token_type: string
  scope: string
  created_at: number
}

enum TokenType {
  application = 'client_credentials',
  user = 'authorization_code',
}

export function getRedirectURI(origin: string, server: string): string {
  const originURL: URL = new URL(origin)
  return `${originURL.origin}/api/${server}/oauth/${encodeURIComponent(originURL.origin)}`
}

export const createApplication = async (origin: string, server: string, KV: KVNamespace): Promise<AppInfo | undefined> => {
  const reqBody: string = JSON.stringify({
    client_name: APP_NAME,
    redirect_uris: getRedirectURI(origin, server),
    scopes: 'read write push',
    website: origin,
  })

  const req = new Request(`https://${server}/api/v1/apps`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: reqBody,
    redirect: 'follow',
  })

  return fetch(req).then(async (res: Response) => {
    if (res.status !== 200) {
      console.error(`Error during registration: ${res.status} ${res.statusText}`)
      return undefined
    }

    const appInfo: AppInfo = await res.json()
    await KV.put(generateKey(origin, server), JSON.stringify(appInfo))
    return appInfo
  })
}

export const readApplication = async (origin: string, server: string, KV: KVNamespace): Promise<AppInfo | undefined> => {
  const value = await KV.get(generateKey(origin, server))
  if (!value)
    return undefined
  const appInfo: AppInfo = JSON.parse(value)
  return appInfo
}

export const deleteApplication = async (origin: string, server: string, KV: KVNamespace): Promise<boolean> => {
  const value = await readApplication(origin, server, KV)
  if (!value)
    return false
  return KV.delete(generateKey(origin, server)).then(() => {
    return true
  }).catch((reason: EvalError) => {
    console.error(`Unexpected error while attempting to deregister the application: ${reason.name} ${reason.message}`)
    return false
  })
}

export const listServers = async (KV: KVNamespace): Promise<string[]> => {
  const servers: Set<string> = new Set<string>()

  return KV.list({ prefix: KV_NAMESPACE_PREFIX }).then((list) => {
    if (!list) {
      console.warn('KV list is empty')
      return new Array<string>()
    }

    const keys = list.keys

    for (const key of keys) {
      const id = key.name?.split(':')[2]
      if (id)
        servers.add(id.toLocaleLowerCase())
    }
    const serverArray = Array.from(servers).sort()
    return serverArray
  })
}

export const createToken = async (origin: string, server: string, KV: KVNamespace, code?: string): Promise<string | undefined> => {
  return readApplication(origin, server, KV).then((app) => {
    if (!app) {
      const m = `Missing credentials for server: ${server}`
      console.error(m)
      return undefined
    }

    const reqBody: string = JSON.stringify({
      grant_type: (code === undefined) ? TokenType.application : TokenType.user,
      client_id: app.client_id,
      client_secret: app.client_secret,
      redirect_uri: getRedirectURI(origin, server),
      scope: 'read write push',
      code,
    })

    const req = new Request(`https://${server}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: reqBody,
      redirect: 'follow',
    })

    return fetch(req).then(async (res: Response) => {
      if (res.status !== 200) {
        console.error(`Error during registration: ${res.status} ${res.statusText}`)
        return undefined
      }
      const token: Token = await res.json()
      const requestParams = new URLSearchParams()
      requestParams.append('server', server)
      requestParams.append('token', token.access_token)
      requestParams.append('vapid_key', app.vapid_key)

      const postAuthURL = `/signin/callback?${requestParams.toString()}`
      return postAuthURL
    }).catch((reason: URIError) => {
      console.error([`Could not complete login to server: ${server}`, reason.message])
      return undefined
    })
  }).catch((reason: URIError) => {
    console.error([`Unable to fetch credentials for server: ${server}`, reason.message])
    return undefined
  })
}
