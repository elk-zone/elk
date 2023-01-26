<script setup lang="ts">
definePageMeta({
  name: 'list',
})

const params = useRoute().params
const listId = $(computedEager(() => params.list as string))

const { client } = $(useMasto())
const { data: tag, refresh } = $(await useAsyncData(() => client.v1.timelines.listList(listId, { limit: 30 }), { default: () => shallowRef() }))

const paginator = client.v1.timelines.listList(listId)
const stream = useStreaming(client => client.v1.stream.streamListTimeline(listId))

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
      <NuxtLink to="/home" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:home-5-line />
        <span>{{ $t('nav.home') }}</span>
      </NuxtLink>
    </template>
    <TimelineList />
    <PublishWidget draft-key="home" border="b base" />
    <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderedTimeline" context="home" />
  </MainContent>
</template>
