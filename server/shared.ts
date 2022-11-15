import { $fetch } from 'ohmyfetch'
import type { AppInfo } from '~/types'

export const registeredApps: Record<string, AppInfo> = {}

const runtimeConfig = useRuntimeConfig()
const promise = $fetch(runtimeConfig.registedAppsUrl)
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
