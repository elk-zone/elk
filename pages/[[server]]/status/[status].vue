<script setup lang="ts">
definePageMeta({
  name: 'status-by-id',
  middleware: async (to) => {
    const params = to.params
    const id = params.status as string
    const serverName = params.server as string
    const status = await fetchStatus(id, serverName)
    return getStatusRoute(status)
  },
})
</script>

<template>
  <div />
</template>
