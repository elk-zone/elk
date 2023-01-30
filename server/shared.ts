// @ts-expect-error unstorage needs to provide backwards-compatible subpath types
import _fs from 'unstorage/drivers/fs'
// @ts-expect-error unstorage needs to provide backwards-compatible subpath types
import _kv from 'unstorage/drivers/cloudflare-kv-http'
// @ts-expect-error unstorage needs to provide backwards-compatible subpath types
import _memory from 'unstorage/drivers/memory'

import { stringifyQuery } from 'ufo'

import { $fetch } from 'ofetch'
import type { Storage } from 'unstorage'

import cached from './cache-driver'

// @ts-expect-error virtual import
import { env } from '#build-info'
// @ts-expect-error virtual import
import { driver } from '#storage-config'

import type { AppInfo } from '~/types'
import { APP_NAME } from '~/constants'

const fs = _fs as typeof import('unstorage/dist/drivers/fs')['default']
const kv = _kv as typeof import('unstorage/dist/drivers/cloudflare-kv-http')['default']
const memory = _memory as typeof import('unstorage/dist/drivers/memory')['default']

const storage = useStorage() as Storage

if (driver === 'fs') {
  const config = useRuntimeConfig()
  storage.mount('servers', fs({ base: config.storage.fsBase }))
}
else if (driver === 'cloudflare') {
  const config = useRuntimeConfig()
  storage.mount('servers', cached(kv({
    accountId: config.cloudflare.accountId,
    namespaceId: config.cloudflare.namespaceId,
    apiToken: config.cloudflare.apiToken,
  })))
}
else if (driver === 'memory') {
  storage.mount('servers', memory())
}

export function getRedirectURI(origin: string, server: string) {
  return `${origin}/api/${server}/oauth?${stringifyQuery({ origin })}`
}

async function fetchAppInfo(origin: string, server: string) {
  const app: AppInfo = await $fetch(`https://${server}/api/v1/apps`, {
    method: 'POST',
    body: {
      client_name: APP_NAME + (env !== 'release' ? ` (${env})` : ''),
      website: 'https://elk.zone',
      redirect_uris: getRedirectURI(origin, server),
      scopes: 'read write follow push',
    },
  })
  return app
}

export async function getApp(origin: string, server: string) {
  const host = origin.replace(/^https?:\/\//, '').replace(/[^\w\d]/g, '-')
  const key = `servers:v2:${server}:${host}.json`.toLowerCase()

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
  const keys = (await storage.getKeys(`servers:v2:${server}:`))
  for (const key of keys)
    await storage.removeItem(key)
}

export async function listServers() {
  const keys = await storage.getKeys('servers:v2:')
  const servers = new Set<string>()
  for await (const key of keys) {
    const id = key.split(':')[2]
    if (id)
      servers.add(id.toLocaleLowerCase())
  }
  return Array.from(servers).sort()
}
