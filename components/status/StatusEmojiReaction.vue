<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  status: mastodon.v1.Status
  details?: boolean
}>()

const {
  status,
} = useStatusActions(props)
</script>

<template>
  <div flex items-center class="status-actions">
    <div v-for="(i, emoji) in status.emojiReactions" :key="i" flex-inline gap-1 mr-4 text-secondary>
      <picture class="custom-emoji" :alt="`:${emoji.name}:`" :data-emoji-id="emoji.name" :title="emoji.name">
        <source :srcset="emoji.staticUrl" media="(prefers-reduced-motion: reduce)">
        <img :src="emoji.url" :alt="`:${emoji.name}:`" title="" style="">
      </picture>
      <CommonLocalizedNumber :keypath="emoji.count" :count="emoji.count" />
    </div>
  </div>
</template>
