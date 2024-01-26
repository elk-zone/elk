<script setup lang="ts">
definePageMeta({
  name: 'tag',
})

const params = useRoute().params
const tagName = $(computedEager(() => params.tag as string))

const { client } = $(useMasto())
const { data: tag, refresh } = $(await useAsyncData(() => client.v1.tags.$select(tagName).fetch(), { default: () => shallowRef() }))

const paginator = client.v1.timelines.tag.$select(tagName).list()
const stream = useStreaming(client => client.hashtag.subscribe({ tag: tagName }))

if (tag) {
  useHydratedHead({
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
      <bdi text-lg font-bold>#{{ tagName }}</bdi>
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
