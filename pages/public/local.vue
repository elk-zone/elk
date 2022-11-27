<script setup lang="ts">
const paginator = useMasto().timelines.getPublicIterable({ local: true })
const stream = await useMasto().stream.streamCommunityTimeline()
onBeforeUnmount(() => stream.disconnect())

useHead({
  title: 'Local',
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Local timeline</span>
    </template>

    <slot>
      <TimelinePaginator v-bind="{ paginator, stream }" />
    </slot>
  </MainContent>
</template>
