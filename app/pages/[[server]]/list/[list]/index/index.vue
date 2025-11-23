<script setup lang="ts">
import type { mastodon } from 'masto'

definePageMeta({
  name: 'list',
})

const params = useRoute().params
const listId = computed(() => params.list as string)

const client = useMastoClient()

const paginator = client.v1.timelines.list.$select(listId.value).list()

// streaming requires user session
let stream: Ref<mastodon.streaming.Subscription | undefined>
if (currentUser.value !== undefined)
  stream = useStreaming(client => client.list.subscribe({ list: listId.value }))
</script>

<template>
  <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderedTimeline" context="home" />
</template>
