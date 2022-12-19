// @ts-expect-error unstorage needs to provide backwards-compatible subpath types
import _fs from 'unstorage/drivers/fs'
// @ts-expect-error unstorage needs to provide backwards-compatible subpath types
import _kv from 'unstorage/drivers/cloudflare-kv-http'
import { parseURL } from 'ufo'

import { $fetch } from 'ofetch'
import type { Storage } from 'unstorage'

import cached from './cache-driver'

import type { AppInfo } from '~/types'
import { APP_NAME } from '~/constants'

const config = useRuntimeConfig()
export const HOST_URL = config.deployUrl
export const HOST_DOMAIN = parseURL(HOST_URL).host!

const fs = _fs as typeof import('unstorage/dist/drivers/fs')['default']
const kv = _kv as typeof import('unstorage/dist/drivers/cloudflare-kv-http')['default']

const storage = useStorage() as Storage

if (config.storage.driver === 'fs') {
  storage.mount('servers', fs({ base: config.storage.fsBase }))
}
else {
  storage.mount('servers', cached(kv({
    accountId: config.cloudflare.accountId,
    namespaceId: config.cloudflare.namespaceId,
    apiToken: config.cloudflare.apiToken,
  })))
}

export function getRedirectURI(server: string) {
  return `${HOST_URL}/api/${server}/oauth`
}

async function fetchAppInfo(server: string) {
  const app: AppInfo = await $fetch(`https://${server}/api/v1/apps`, {
    method: 'POST',
    body: {
      client_name: APP_NAME + (config.public.env === 'local' ? ' (dev)' : ''),
      website: 'https://elk.zone',
      redirect_uris: getRedirectURI(server),
      scopes: 'read write follow push',
    },
  })
  return app
}

export async function getApp(server: string) {
  const key = `servers:${HOST_DOMAIN.replace(/[^\w\d]/g, '-')}:${server}.json`

  try {
    if (await storage.hasItem(key))
      return await storage.getItem(key) as Promise<AppInfo>
    const appInfo = await fetchAppInfo(server)
    await storage.setItem(key, appInfo)
    return appInfo
  }
  catch {
    return null
  }
}
