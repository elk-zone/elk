<script setup lang="ts">
import type { akkoma } from '@bdxtown/akko'

const { isSupported, effectiveType } = useNetwork()
const isSlow = computed(() => isSupported.value && effectiveType.value && ['slow-2g', '2g', '3g'].includes(effectiveType.value))
const limit = computed(() => isSlow.value ? 10 : 30)
const replyVisibility = usePreferences('replyVisibility')

const paginator = useAkkoClient().v1.timelines.home.list({ limit: limit.value, replyVisibility: replyVisibility.value })
const stream = useStreaming(client => client.user.subscribe())
function reorderAndFilter(items: akkoma.v1.Status[]) {
  return reorderedTimeline(items, 'home')
}
</script>

<template>
  <div>
    <PublishWidgetList :expanded="true" draft-key="home" />
    <div h="1px" w-auto bg-border mb-3 />
    <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderAndFilter" context="home" />
  </div>
</template>
