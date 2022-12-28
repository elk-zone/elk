<script setup lang="ts">
const paginator = useMasto().timelines.iteratePublic()
const stream = useMasto().stream.streamPublicTimeline()
onBeforeUnmount(() => stream.then(s => s.disconnect()))
</script>

<template>
  <div>
    <TimelinePaginator v-bind="{ paginator, stream }" context="public" />
  </div>
</template>
