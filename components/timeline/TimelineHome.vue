<script setup lang="ts">
const paginator = useMasto().timelines.iterateHome()
const stream = await useMasto().stream.streamUser()
onBeforeUnmount(() => stream.disconnect())
</script>

<template>
  <div>
    <PublishWidget draft-key="home" border="b base" />
    <TimelinePaginator v-bind="{ paginator, stream }" context="home" />
  </div>
</template>
