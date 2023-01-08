<script setup lang="ts">
const paginator = useMasto().v1.timelines.listPublic({ limit: 30, local: true })
const stream = useMasto().v1.stream.streamCommunityTimeline()
onBeforeUnmount(() => stream.then(s => s.disconnect()))
</script>

<template>
  <div>
    <TimelinePaginator v-bind="{ paginator, stream }" context="public" />
  </div>
</template>
