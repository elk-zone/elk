import type { AppInfo } from '#shared/types'
// @ts-expect-error virtual import
import { env } from '#build-info'
// @ts-expect-error virtual import
import { driver } from '#storage-config'
import { $fetch } from 'ofetch'

import kv from 'unstorage/drivers/cloudflare-kv-http'

import fs from 'unstorage/drivers/fs'

import memory from 'unstorage/drivers/memory'

import vercelKVDriver from 'unstorage/drivers/vercel-kv'

import { version } from '~~/config/env'
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
  const [apps, v2Instance] = await Promise.all([
    $fetch(`https://${server}/api/v1/apps`, {
      method: 'POST',
      headers: {
        'user-agent': defaultUserAgent,
      },
      body: {
        client_name: APP_NAME + (env !== 'release' ? ` (${env})` : ''),
        website: origin,
        redirect_uris: getRedirectURI(origin, server),
        scopes: 'read write follow push',
      },
    }),
    $fetch(`https://${server}/api/v2/instance`, {
      headers: {
        'user-agent': defaultUserAgent,
      },
    })
      .catch(() => null),
  ])

  // vapid.public_key prop is only available on Mastodon v4.3+
  const v2InstanceVapidKey: string | undefined = v2Instance?.configuration?.vapid?.public_key
  const app: AppInfo = {
    ...apps,
    // prefer vapid key from `/api/v2/instance` if available
    // since `vapid_key` from `/api/v1/apps` was deprecated on Mastodon v4.3.0+
    // ref. apps API methods - Mastodon documentation
    // - https://docs.joinmastodon.org/methods/apps/#create
    ...v2InstanceVapidKey ? { vapid_key: v2InstanceVapidKey } : {},
  }

  return app
}

export async function getApp(origin: string, server: string) {
  const host = origin.replace(/^https?:\/\//, '').replace(/\W/g, '-').replace(/\?.*$/, '')
  const key = `servers:v4:${server}:${host}.json`.toLowerCase()

  try {
    if (await storage.hasItem(key))
      return (storage.getItem(key, {}) as Promise<AppInfo>)
    const appInfo = await fetchAppInfo(origin, server)
    // cache `appInfo` for 1 week to prevent permanent lockout
    // note that `unstorage` supports `ttl` only for some storage drivers like cloudflare
    await storage.setItem(key, appInfo, { ttl: 60 * 60 * 24 * 7 /* 1 week */ })
    return appInfo
  }
  catch {
    return null
  }
}

export async function deleteApp(server: string) {
  const keys = (await storage.getKeys(`servers:v4:${server}:`))
  for (const key of keys)
    await storage.removeItem(key)
}

export async function listServers() {
  const keys = await storage.getKeys('servers:v4:')
  const servers = new Set<string>()
  for (const key of keys) {
    const id = key.split(':')[2]
    if (id)
      servers.add(id.toLocaleLowerCase())
  }
  return Array.from(servers).sort()
}
