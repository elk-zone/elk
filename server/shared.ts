import { $fetch } from 'ohmyfetch'
import type { AppInfo } from '~/types'

export const registeredApps: Record<string, AppInfo> = {}

const promise = $fetch(process.env.APPS_JSON_URL || 'http://localhost:3000/registered-apps.json')
  .then(r => Object.assign(registeredApps, r))
  .catch((e) => {
    if (process.dev)
      console.error('Failed to fetch registered apps,\nyou may need to run `nr register-apps` first')
    else
      console.error('Failed to fetch registered apps')
    console.error(e)
  })

export async function getApp(server: string) {
  await promise
  return registeredApps[server]
}
