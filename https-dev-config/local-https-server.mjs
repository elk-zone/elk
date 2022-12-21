import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

process.env.NITRO_SSL_CERT = readFileSync(fileURLToPath(new URL('./localhost.crt', import.meta.url)), 'utf8')
process.env.NITRO_SSL_KEY = readFileSync(fileURLToPath(new URL('./localhost.key', import.meta.url)), 'utf8')

async function run() {
  await import('../.output/server/index.mjs')
}

run()
