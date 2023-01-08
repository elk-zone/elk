<script lang="ts" setup>
import type { mastodon } from 'masto'

const {
  tag,
} = $defineProps<{
  tag: mastodon.v1.Tag
}>()

const to = $computed(() => new URL(tag.url).pathname)
</script>

<template>
  <NuxtLink :to="to" block p4 hover:bg-active flex justify-between>
    <div>
      <h4 text-size-base leading-normal font-medium line-clamp-1 break-all ws-pre-wrap>
        <span>#</span>
        <span hover:underline>{{ tag.name }}</span>
      </h4>
      <CommonTrending :history="tag.history" text-sm text-secondary line-clamp-1 ws-pre-wrap break-all />
    </div>
    <div flex items-center>
      <CommonTrendingCharts :history="tag.history" />
    </div>
  </NuxtLink>
</template>
