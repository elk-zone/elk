export default defineEventHandler(async (event) => {
  const { server } = getRouterParams(event)
  const { key } = getQuery(event)

  if (key !== String(useRuntimeConfig().adminKey))
    return { status: false, error: 'incorrect key' }

  await deleteApp(server)

  return { status: true }
})
