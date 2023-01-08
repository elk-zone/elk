<script setup lang="ts">
const paginator = useMasto().v1.timelines.listHome({ limit: 30 })
const stream = useMasto().v1.stream.streamUser()
onBeforeUnmount(() => stream?.then(s => s.disconnect()))
</script>

<template>
  <div>
    <PublishWidget draft-key="home" border="b base" />
    <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderedTimeline" context="home" />
  </div>
</template>
