<script setup lang="ts">
import type { Status } from 'masto'
const paginator = useMasto().timelines.iterateHome()
const stream = useMasto().stream.streamUser()
onBeforeUnmount(() => stream?.then(s => s.disconnect()))
</script>

<template>
  <div>
    <PublishWidget draft-key="home" border="b base" />
    <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderedTimeline" context="home" />
  </div>
</template>
