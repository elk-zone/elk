<script setup lang="ts">
import { parseURL } from 'ufo'

definePageMeta({
  name: 'permalink',
  middleware: async (to) => {
    const HANDLED_MASTO_URL = /^(https?:\/\/)?(\w+\.)+\w+\/(@[@\w\d\.]+)(\/\d+)?$/
    try {
      let permalink = Array.isArray(to.params.permalink)
        ? to.params.permalink.join('/')
        : to.params.permalink

      if (!HANDLED_MASTO_URL.test(permalink))
        return '/home'

      if (!permalink.startsWith('http'))
        permalink = `https://${permalink}`

      if (!currentUser.value) {
        const { host, pathname } = parseURL(permalink)
        await loginTo({ server: host! })
        return pathname
      }

      const { value } = await useMasto().search({ q: permalink, resolve: true, limit: 1 }).next()

      const { accounts, statuses } = value
      if (statuses[0])
        return getStatusRoute(statuses[0])

      if (accounts[0])
        return getAccountRoute(accounts[0])
    }
    catch {}

    return '/home'
  },
})
</script>

<template>
  <div />
</template>
