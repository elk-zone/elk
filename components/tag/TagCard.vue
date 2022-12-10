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
  <NuxtLink :to="to" block p4>
    <h4 font-medium line-clamp-1 break-all ws-pre-wrap>
      <spn>#</spn>
      <span hover:underline>{{ tag.name }}</span>
    </h4>
    <p text-secondary-light>
      {{ tag.history?.[0].uses }}
    </p>
  </NuxtLink>
</template>
