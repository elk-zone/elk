<script setup lang="ts">
definePageMeta({
  name: 'tag',
})

const params = useRoute().params
const tagName = $(computedEager(() => params.tag as string))

const masto = useMasto()
const { data: tag, refresh } = $(await useAsyncData(() => masto.v1.tags.fetch(tagName), { watch: [isMastoInitialised], immediate: isMastoInitialised.value }))

const paginator = masto.v1.timelines.listHashtag(tagName)
const stream = masto.v1.stream.streamTagTimeline(tagName)
onBeforeUnmount(() => stream.then(s => s.disconnect()))

if (tag) {
  useHeadFixed({
    title: () => `#${tag.name}`,
  })
}

if (process.server) {
  const masto = useMasto()
  const route = useRoute()
  // render OG tags for crawlers
  const client = await masto.loginTo({
    server: route.params.server as string,
  })
  const tag = await client.v1.tags.fetch((tagName))
  if (tag) {
    useHead({
      title: `#${tag.name}`,
      meta: [
        { property: 'og:title', content: `#${tag.name}` },
        { property: 'og:description', content: '' },
      ],
    })
  }
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

    <template #actions>
      <template v-if="typeof tag?.following === 'boolean'">
        <TagActionButton :tag="tag" @change="refresh()" />
      </template>
    </template>

    <slot>
      <TimelinePaginator v-bind="{ paginator, stream }" context="public" />
    </slot>
  </MainContent>
</template>
