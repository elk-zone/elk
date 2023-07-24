<script setup lang="ts">
definePageMeta({
  name: 'status-by-id',
  middleware: async (to) => {
    const params = to.params
    const id = params.status as string
    const status = await fetchStatus(id)
    if (status)
      return getStatusRoute(status)

    if (process.dev)
      console.error(`Status not found: ${id}`)

    return undefined
  },
})
</script>

<template>
  <div />
</template>
