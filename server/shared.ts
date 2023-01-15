// @ts-expect-error unstorage needs to provide backwards-compatible subpath types
import _fs from 'unstorage/drivers/fs'
// @ts-expect-error unstorage needs to provide backwards-compatible subpath types
import _kv from 'unstorage/drivers/cloudflare-kv-http'

import { stringifyQuery } from 'ufo'

import { $fetch } from 'ofetch'
import type { Storage } from 'unstorage'

import cached from './cache-driver'

import type { AppInfo } from '~/types'
import { APP_NAME } from '~/constants'

const config = useRuntimeConfig()

const fs = _fs as typeof import('unstorage/dist/drivers/fs')['default']
const kv = _kv as typeof import('unstorage/dist/drivers/cloudflare-kv-http')['default']

const storage = useStorage() as Storage

if (config.storage.driver === 'fs') {
  storage.mount('servers', fs({ base: config.storage.fsBase }))
}
else if (config.storage.driver === 'cloudflare') {
  storage.mount('servers', cached(kv({
    accountId: config.cloudflare.accountId,
    namespaceId: config.cloudflare.namespaceId,
    apiToken: config.cloudflare.apiToken,
  })))
}

export function getRedirectURI(origin: string, server: string) {
  return `${origin}/api/${server}/oauth?${stringifyQuery({ origin })}`
}

async function fetchAppInfo(origin: string, server: string) {
  const app: AppInfo = await $fetch(`https://${server}/api/v1/apps`, {
    method: 'POST',
    body: {
      client_name: APP_NAME + (config.public.env !== 'release' ? ` (${config.public.env})` : ''),
      website: 'https://elk.zone',
      redirect_uris: getRedirectURI(origin, server),
      scopes: 'read write follow push',
    },
  })
  return app
}

export async function getApp(origin: string, server: string) {
  const key = `servers:${origin.replace(/[^\w\d]/g, '-')}:${server}.json`

  try {
    if (await storage.hasItem(key))
      return await storage.getItem(key) as Promise<AppInfo>
    const appInfo = await fetchAppInfo(origin, server)
    await storage.setItem(key, appInfo)
    return appInfo
  }
  catch {
    return null
  }
}

export async function deleteApp(server: string) {
  const keys = (await storage.getKeys('servers:')).filter(k => k.endsWith(`${server}.json`))
  for (const key of keys)
    await storage.removeItem(key)
}

export async function listServers() {
  const keys = await storage.getKeys('servers:')
  const servers = new Set<string>()
  for await (const key of keys) {
    const id = key.split(':').pop()!.replace(/\.json$/, '')
    if (id)
      servers.add(id.toLocaleLowerCase())
  }
  return Array.from(servers).sort()
}
