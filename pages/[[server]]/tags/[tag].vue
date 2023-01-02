<script setup lang="ts">
definePageMeta({
  name: 'tag',
})

const params = useRoute().params
const tagName = $(computedEager(() => params.tag as string))

const masto = useMasto()
const { data: tag, refresh } = $(await useAsyncData(() => masto.tags.fetch(tagName), { watch: [isMastoInitialised], immediate: isMastoInitialised.value }))

const paginator = masto.timelines.iterateHashtag(tagName)
const stream = masto.stream.streamTagTimeline(tagName)
onBeforeUnmount(() => stream.then(s => s.disconnect()))

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
