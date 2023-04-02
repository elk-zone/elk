<script setup lang="ts">
import type { mastodon } from 'masto'

const paginator = useMastoClient().v1.timelines.listHome({ limit: 30 })
const stream = $(useStreaming(client => client.v1.stream.streamUser()))

function reorderAndFilter(items: mastodon.v1.Status[]) {
  return reorderedTimeline(items, 'home')
}

const homeFilter = useHomeFilter()

function clientSideFilter(items: mastodon.v1.Status[]) {
  const { bot, sensitive, repost, mutual, tag } = $(homeFilter.value)

  return items.filter((item) => {
    if (bot && sensitive && repost && mutual && tag)
      return true

    if (!bot && item.account.bot)
      return false

    if (!sensitive && item.sensitive)
      return false

    if (!repost && item.reblog != null)
      return false

    // if (!mutual && ??)
    //   This would require a lookup of the user's followers
    //   return false

    // if (!tag && ??)
    //   This would require a lookup of the user's tags
    //   return false

    return true
  })
}

const nuxtApp = useNuxtApp()

watch(homeFilter, () => {
  nuxtApp.hooks.callHook('elk-timeline-home-filter:change')
})
</script>

<template>
  <div>
    <PublishWidget draft-key="home" border="b base" />
    <TimelinePaginator v-bind="{ paginator, stream }" :preprocess="reorderAndFilter" :postprocess="clientSideFilter" context="home" />
  </div>
</template>
