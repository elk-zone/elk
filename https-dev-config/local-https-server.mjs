import { readFileSync } from 'fs'

process.env.NITRO_SSL_CERT = readFileSync('./localhost.crt', 'utf8')
process.env.NITRO_SSL_KEY = readFileSync('./localhost.key', 'utf8')

async function run() {
  await import('../.output/server/index.mjs')
}

run()

