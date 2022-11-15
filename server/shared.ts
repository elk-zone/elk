import { $fetch } from 'ohmyfetch'

export interface AppInfo {
  id: string
  name: string
  website: string | null
  redirect_uri: string
  client_id: string
  client_secret: string
  vapid_key: string
}

export const registeredApps: Record<string, AppInfo> = {}

const promise = $fetch(process.env.APPS_JSON_URL || 'http://localhost:3000/registered-apps.json')
  .then(r => Object.assign(registeredApps, r))

export async function getApp(server: string) {
  await promise
  return registeredApps[server]
}
