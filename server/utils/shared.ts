import type { AppInfo } from '~/types'
// @ts-expect-error virtual import
import { env } from '#build-info'
// @ts-expect-error virtual import
import { driver } from '#storage-config'
import { $fetch } from 'ofetch'

import kv from 'unstorage/drivers/cloudflare-kv-http'

import fs from 'unstorage/drivers/fs'

import memory from 'unstorage/drivers/memory'

import vercelKVDriver from 'unstorage/drivers/vercel-kv'

import { version } from '~/config/env'
import { APP_NAME } from '~/constants'
import cached from '../cache-driver'

const storage = useStorage<AppInfo>()

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
else if (driver === 'vercel') {
  const config = useRuntimeConfig()
  storage.mount('servers', cached(vercelKVDriver({
    url: config.vercel.url,
    token: config.vercel.token,
    env: config.vercel.env,
    base: config.vercel.base,
  })))
}
else if (driver === 'memory') {
  storage.mount('servers', memory())
}

export function getRedirectURI(origin: string, server: string) {
  origin = origin.replace(/\?.*$/, '')
  return `${origin}/api/${server}/oauth/${encodeURIComponent(origin)}`
}

export const defaultUserAgent = `${APP_NAME}/${version}`

async function fetchAppInfo(origin: string, server: string) {
  const app: AppInfo = await $fetch(`https://${server}/api/v1/apps`, {
    method: 'POST',
    headers: {
      'user-agent': defaultUserAgent,
    },
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
  const host = origin.replace(/^https?:\/\//, '').replace(/\W/g, '-').replace(/\?.*$/, '')
  const key = `servers:v3:${server}:${host}.json`.toLowerCase()

  try {
    if (await storage.hasItem(key))
      return (storage.getItem(key, {}) as Promise<AppInfo>)
    const appInfo = await fetchAppInfo(origin, server)
    await storage.setItem(key, appInfo)
    return appInfo
  }
  catch {
    return null
  }
}

export async function deleteApp(server: string) {
  const keys = (await storage.getKeys(`servers:v3:${server}:`))
  for (const key of keys)
    await storage.removeItem(key)
}

export async function listServers() {
  const keys = await storage.getKeys('servers:v3:')
  const servers = new Set<string>()
  for await (const key of keys) {
    const id = key.split(':')[2]
    if (id)
      servers.add(id.toLocaleLowerCase())
  }
  return Array.from(servers).sort()
}
