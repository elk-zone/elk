<script setup lang="ts">
const paginator = useMasto().timelines.iteratePublic({ local: true })
const stream = useMasto().stream.streamCommunityTimeline()
onBeforeUnmount(() => stream.then(s => s.disconnect()))
</script>

<template>
  <div>
    <TimelinePaginator v-bind="{ paginator, stream }" context="public" />
  </div>
</template>
