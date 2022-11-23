import fs from 'fs-extra'
import { $fetch } from 'ohmyfetch'
import { APP_NAME } from '~/constants'
import type { AppInfo } from '~/types'

const KNOWN_SERVERS = [
  'mastodon.social',
  'mas.to',
  'fosstodon.org',
]

const KNOWN_DOMAINS = [
  'http://localhost:3000',
  'https://elk.netlify.app',
  'https://elk.zone',
]

const filename = 'public/registered-apps.json'

let registeredApps: Record<string, AppInfo> = {}

if (fs.existsSync(filename))
  registeredApps = await fs.readJSON(filename)

for (const server of KNOWN_SERVERS) {
  const redirect_uris = [
    'urn:ietf:wg:oauth:2.0:oob',
    ...KNOWN_DOMAINS.map(d => `${d}/api/${server}/oauth`),
  ].join('\n')

  if (!registeredApps[server] || registeredApps[server].redirect_uri !== redirect_uris) {
    const app = await $fetch(`https://${server}/api/v1/apps`, {
      method: 'POST',
      body: {
        client_name: APP_NAME,
        redirect_uris,
        scopes: 'read write follow push',
      },
    })

    registeredApps[server] = app

    console.log(`Registered app for ${server}`)
  }
}

if (!fs.existsSync('public'))
  await fs.mkdir('public')

await fs.writeJSON(filename, registeredApps, { spaces: 2, EOL: '\n' })
