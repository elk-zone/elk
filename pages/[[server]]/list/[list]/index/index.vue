<script setup lang="ts">
definePageMeta({
  name: 'list',
})

const params = useRoute().params
const listId = $(computedEager(() => params.list as string))

const client = useMastoClient()

const paginator = client.v1.timelines.listList(listId)
const stream = useStreaming(client => client.v1.stream.streamListTimeline(listId))
</script>

<template>
  <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderedTimeline" context="home" />
</template>
