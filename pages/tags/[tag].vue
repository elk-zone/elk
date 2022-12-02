<script setup lang="ts">
const params = useRoute().params
const tagName = $(computedEager(() => params.tag as string))

const { data: tag, refresh } = $(await useAsyncData(() => useMasto().tags.fetch(tagName)))

const paginator = useMasto().timelines.getHashtagIterable(tagName)
const stream = await useMasto().stream.streamTagTimeline(tagName)
onBeforeUnmount(() => stream.disconnect())

if (tag) {
  useHeadFixed({
    title: () => `#${tag.name}`,
  })
}

onReactivated(() => {
  // Silently update data when reentering the page
  // The user will see the previous content first, and any changes will be updated to the UI when the request is completed
  refresh()
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>#{{ tagName }}</span>
    </template>

    <template v-if="typeof tag?.following === 'boolean'" #actions>
      <TagActionButton :tag="tag" @change="refresh()" />
    </template>

    <slot>
      <TimelinePaginator v-bind="{ paginator, stream }" context="public" />
    </slot>
  </MainContent>
</template>
