<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

const replyVisibility = usePreferences('replyVisibility')
const paginator = useAkkoClient().v1.timelines.public.list({ limit: 30, local: true, replyVisibility: replyVisibility.value })
const stream = useStreaming(client => client.public.local.subscribe())
function reorderAndFilter(items: akkoma.v1.Status[]) {
  return reorderedTimeline(items, 'public')
}

const followedTags = ref<akkoma.v1.Tag[] | undefined>(undefined)

onMounted(async () => {
  if (currentUser.value !== undefined) {
    followedTags.value = (await useAkko().client.value.v1.followedTags.list({ limit: 0 }))
  }
})
</script>

<template>
  <div>
    <TimelinePaginator :followed-tags="followedTags" v-bind="{ paginator, stream }" :preprocess="reorderAndFilter" context="public" />
  </div>
</template>
