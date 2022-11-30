<script setup lang="ts">
definePageMeta({
  middleware: async (to) => {
    const params = to.params
    const id = params.status as string
    const status = await fetchStatus(id)
    return resolveStatusPath(status)
  },
})
</script>

<template>
  <div />
</template>
