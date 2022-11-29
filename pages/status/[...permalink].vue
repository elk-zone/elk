<script setup lang="ts">
definePageMeta({
  middleware: async (to) => {
    let permalink = Array.isArray(to.params.permalink)
      ? to.params.permalink.join('/')
      : to.params.permalink

    if (!permalink.startsWith('http'))
      permalink = `https://${permalink}`

    const { value: { statuses } } = await useMasto().search({ q: permalink, resolve: true, limit: 1 }).next()
    if (statuses[0]) {
      return {
        path: getStatusPath(statuses[0]),
        state: {
          status: statuses[0] as any,
        },
      }
    }
    return '/home'
  },
})
</script>

<template>
  <div />
</template>
