<script setup lang="ts">
import type { akkoma } from 'akko'

const paginator = useAkkoClient().v1.timelines.bubble.list({ limit: 30 })

function reorderAndFilter(items: akkoma.v1.Status[]) {
  return reorderedTimeline(items, 'public')
}
</script>

<template>
  <div>
    <TimelinePaginator v-bind="{ paginator }" :preprocess="reorderAndFilter" context="public" />
  </div>
</template>
