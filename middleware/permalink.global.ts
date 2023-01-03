export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server)
    return

  const masto = useMasto()

  // Skip running middleware before masto has been initialised
  if (!masto)
    return

  if (!('server' in to.params))
    return

  const user = currentUser.value

  // Handle redirecting to new permalink structure for users with old links
  if (!to.params.server) {
    return {
      ...to,
      params: {
        ...to.params,
        server: user.server,
      },
    }
  }

  // No need to additionally resolve an id if we're already logged in
  if (user.server === to.params.server)
    return

  masto.loginTo({
    server: to.params.server as string,
  })
})
