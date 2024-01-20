<script setup lang="ts">
import type { mastodon } from 'masto'

const paginator = useMastoClient().v1.timelines.home.list({ limit: 30 })
const stream = useStreaming(client => client.user.subscribe())
function reorderAndFilter(items: mastodon.v1.Status[]) {
  return reorderedTimeline(items, 'home')
}
</script>

<template>
  <div>
    <PublishWidget draft-key="home" border="b base" />
    <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderAndFilter" context="home" />
  </div>
</template>
