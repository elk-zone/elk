<script setup lang="ts">
const paginator = useMastoClient().v1.timelines.listHome({ limit: 30 })
const stream = $(useStreaming(client => client.v1.stream.streamUser()))
</script>

<template>
  <div>
    <PublishWidget draft-key="home" border="b base" />
    <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderedTimeline" context="home" />
  </div>
</template>
