<script setup lang="ts">
const paginator = useMastoClient().v1.timelines.public.list({ limit: 30, local: true })
const stream = useStreaming(client => client.public.local.subscribe())
</script>

<template>
  <div>
    <TimelinePaginator v-bind="{ paginator, stream }" context="public" />
  </div>
</template>
