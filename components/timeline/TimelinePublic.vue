<script setup lang="ts">
const paginator = useMasto().v1.timelines.listPublic()
const stream = useMasto().v1.stream.streamPublicTimeline()
onBeforeUnmount(() => stream.then(s => s.disconnect()))
</script>

<template>
  <div>
    <TimelinePaginator v-bind="{ paginator, stream }" context="public" />
  </div>
</template>
