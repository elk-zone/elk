<script setup lang="ts">
const paginator = useMasto().timelines.getPublicIterable()
const stream = await useMasto().stream.streamPublicTimeline()
onBeforeUnmount(() => stream.disconnect())

useHead({
  title: 'Federated',
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Federated Timeline</span>
    </template>

    <slot>
      <TimelinePaginator v-bind="{ paginator, stream }" />
    </slot>
  </MainContent>
</template>
