<script lang="ts" setup>
import type { Tag } from 'masto'

const {
  tag,
} = $defineProps<{
  tag: Tag
}>()

const to = $computed(() => new URL(tag.url).pathname)
</script>

<template>
  <NuxtLink :to="to" block p4 hover:bg-active>
    <h4 text-size-base leading-normal font-medium line-clamp-1 break-all ws-pre-wrap>
      <spn>#</spn>
      <span hover:underline>{{ tag.name }}</span>
    </h4>
    <CommonTrending :history="tag.history" text-sm text-secondary />
  </NuxtLink>
</template>
