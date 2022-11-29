<script setup lang="ts">
import { parseURL } from 'ufo'

definePageMeta({
  middleware: async (to) => {
    let permalink = Array.isArray(to.params.permalink)
      ? to.params.permalink.join('/')
      : to.params.permalink

    if (!permalink.startsWith('http'))
      permalink = `https://${permalink}`

    if (!currentUser.value) {
      const { host, pathname } = parseURL(permalink)
      await loginTo({ server: host! })
      return pathname
    }

    const { value } = await useMasto().search({ q: permalink, resolve: true, limit: 1 }).next()

    const { accounts, statuses } = value
    if (statuses[0]) {
      return {
        path: getStatusPath(statuses[0]),
        state: {
          status: statuses[0] as any,
        },
      }
    }
    if (accounts[0])
      return getAccountPath(accounts[0])

    return '/home'
  },
})
</script>

<template>
  <div />
</template>
