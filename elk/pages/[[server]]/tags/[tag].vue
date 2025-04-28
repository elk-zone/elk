<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

definePageMeta({
  name: 'tag',
})

const params = useRoute().params
const tagName = computed(() => params.tag as string)

const { client } = useAkko()
const { data: tag, refresh } = await useAsyncData(() => client.value.v1.tags.$select(tagName.value).fetch(), { default: () => shallowRef() })

const paginator = client.value.v1.timelines.tag.$select(tagName.value).list()
const stream = useStreaming(client => client.hashtag.subscribe({ tag: tagName.value }))

if (tag.value) {
  useHydratedHead({
    title: () => `#${tag.value.name}`,
  })
}

onReactivated(() => {
  // Silently update data when reentering the page
  // The user will see the previous content first, and any changes will be updated to the UI when the request is completed
  refresh()
})

const followedTags = ref<akkoma.v1.Tag[] | undefined>(undefined)

onMounted(async () => {
  if (currentUser.value !== undefined) {
    followedTags.value = (await useAkko().client.value.v1.followedTags.list({ limit: 0 }))
  }
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
      <TimelinePaginator :followed-tags="followedTags" v-bind="{ paginator, stream }" context="public" />
    </slot>
  </MainContent>
</template>
