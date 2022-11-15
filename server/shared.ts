import { $fetch } from 'ohmyfetch'
import type { AppInfo } from '~/types'

export const registeredApps: Record<string, AppInfo> = {}

const runtimeConfig = useRuntimeConfig()
const promise = $fetch(runtimeConfig.registedAppsUrl, { responseType: 'json' })
  .then((r) => {
    Object.assign(registeredApps, r)
    // eslint-disable-next-line no-console
    console.log(`\n${Object.keys(registeredApps).length} registered apps loaded from ${runtimeConfig.registedAppsUrl.split(/\/+/g)[1]}`)
    // eslint-disable-next-line no-console
    console.log(`${Object.keys(registeredApps).map(i => ` - ${i}`).join('\n')}\n`)
  })
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
