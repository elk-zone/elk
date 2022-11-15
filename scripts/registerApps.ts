import fs from 'fs-extra'
import type { Client } from 'masto'
import { $fetch } from 'ohmyfetch'
import { APP_NAME } from '~~/constants'

const KNOWN_SERVERS = [
  'mastodon.social',
  'mas.to',
  'fosstodon.org',
]

const filename = 'public/registered-apps.json'

let registeredApps: Record<string, Client> = {}

if (fs.existsSync(filename))
  registeredApps = await fs.readJSON(filename)

for (const server of KNOWN_SERVERS) {
  if (registeredApps[server])
    continue

  const app = await $fetch(`https://${server}/api/v1/apps`, {
    method: 'POST',
    body: {
      client_name: APP_NAME,
      redirect_uris: [
        'urn:ietf:wg:oauth:2.0:oob',
        'http://localhost:3000/*',
        'https://nuxtodon.netlify.app/*',
      ].join('\n'),
      scopes: 'read write follow push',
    },
  })

  registeredApps[server] = app

  console.log(`Registered app for ${server}`)
}

await fs.writeJSON(filename, registeredApps, { spaces: 2, EOL: '\n' })
