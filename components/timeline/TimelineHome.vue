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
    <PublishWidgetList draft-key="home" />
    <div h="1px" w-auto bg-border mb-3 />
    <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderAndFilter" context="home" />
  </div>
</template>
