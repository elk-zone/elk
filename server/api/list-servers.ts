import { defineEventHandler } from 'h3'
import { listServers } from '~/server/shared'

let servers: string[]

export default defineEventHandler(async () => {
  if (!servers)
    servers = await listServers()
  return servers
})
