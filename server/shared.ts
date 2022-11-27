// @ts-expect-error unstorage needs to provide backwards-compatible subpath types
import _fs from 'unstorage/drivers/fs'
// @ts-expect-error unstorage needs to provide backwards-compatible subpath types
import _kv from 'unstorage/drivers/cloudflare-kv-http'
import { isCI } from 'std-env'

import { $fetch } from 'ohmyfetch'
import type { Storage } from 'unstorage'

import cached from './cache-driver'

import type { AppInfo } from '~/types'
import { APP_NAME } from '~/constants'

const runtimeConfig = useRuntimeConfig()
export const HOST_DOMAIN = runtimeConfig.deployUrl
  || (process.dev || !isCI ? 'http://localhost:5314' : 'https://elk.zone')

const fs = _fs as typeof import('unstorage/dist/drivers/fs')['default']
const kv = _kv as typeof import('unstorage/dist/drivers/cloudflare-kv-http')['default']

const storage = useStorage() as Storage

if (process.dev || !isCI) {
  storage.mount('servers', fs({ base: 'node_modules/.cache/servers' }))
}
else {
  const config = useRuntimeConfig()
  storage.mount('servers', cached(kv({
    accountId: config.cloudflare.accountId,
    namespaceId: config.cloudflare.namespaceId,
    apiToken: config.cloudflare.apiToken,
  })))
}

async function fetchAppInfo(host: string, server: string) {
  const redirect_uris = [
    'urn:ietf:wg:oauth:2.0:oob',
    `${host}/api/${server}/oauth`,
  ].join('\n')

  const app: AppInfo = await $fetch(`https://${server}/api/v1/apps`, {
    method: 'POST',
    body: {
      client_name: APP_NAME,
      redirect_uris,
      scopes: 'read write follow push',
    },
  })
  return app
}

const serverKey = (host: string, server: string) => `servers:${host}:${server}.json`

export async function getApp(host: string, server: string) {
  const key = serverKey(host, server)
  if (await storage.hasItem(key))
    return storage.getItem(key) as Promise<AppInfo>

  try {
    const appInfo = await fetchAppInfo(host, server)
    await storage.setItem(key, appInfo)
    return appInfo
  }
  catch {
    return null
  }
}
