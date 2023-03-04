let servers: string[]

export default defineEventHandler(async () => {
  if (!servers)
    servers = await listServers()
  return servers
})
