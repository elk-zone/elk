<script setup lang="ts">
const params = useRoute().params
const tag = $(computedEager(() => params.tag as string))

const paginator = useMasto().timelines.getHashtagIterable(tag)
const stream = await useMasto().stream.streamTagTimeline(tag)
onBeforeUnmount(() => stream.disconnect())

useHead({
  title: `#${tag}`,
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>#{{ tag }}</span>
    </template>

    <slot>
      <TimelinePaginator v-bind="{ paginator, stream }" />
    </slot>
  </MainContent>
</template>
