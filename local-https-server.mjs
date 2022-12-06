import { readFileSync } from 'fs'

const cert = process.env.SSL_CERT_FILE
const key = process.env.SSL_KEY_FILE

if (cert && key) {
  process.env.NITRO_SSL_CERT = readFileSync(cert, 'utf8')
  process.env.NITRO_SSL_KEY = readFileSync(key, 'utf8')
}

async function run() {
  await import('./.output/server/index.mjs')
}

run()

