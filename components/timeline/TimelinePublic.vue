<script setup lang="ts">
import type { mastodon } from 'masto'

const paginator = useMastoClient().v1.timelines.listPublic({ limit: 30 })
const stream = useStreaming(client => client.v1.stream.streamPublicTimeline())
const reorderAndFilter = (items: mastodon.v1.Status[]) => reorderedTimeline(items, 'public')
</script>

<template>
  <div>
    <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderAndFilter" context="public" />
  </div>
</template>
