<script setup lang="ts">
import type { mastodon } from 'masto'

const paginator = useMastoClient().v1.timelines.public.list({ limit: 30, local: true })
const stream = useStreaming(client => client.public.local.subscribe())
function preprocess(items: mastodon.v1.Status[]) {
  return filterAndReorderTimeline(items, 'public')
}

let followedTags: mastodon.v1.Tag[]
if (currentUser.value !== undefined) {
  const { client } = useMasto()
  const paginator = client.value.v1.followedTags.list()
  followedTags = (await paginator.values().next()).value ?? []
}
</script>

<template>
  <div>
    <TimelinePaginator :followed-tags="followedTags" v-bind="{ paginator, stream }" :preprocess="preprocess" context="public" />
  </div>
</template>
