<script setup lang="ts">
const paginator = useMastoClient().v1.timelines.listPublic({ limit: 30, local: true })
const stream = useStreaming(client => client.v1.stream.streamCommunityTimeline())
</script>

<template>
  <div>
    <TimelinePaginator v-bind="{ paginator, stream }" context="public" />
  </div>
</template>
