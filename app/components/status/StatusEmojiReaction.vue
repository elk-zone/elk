<script setup lang="ts">
import type { mastodon } from 'masto'
import { getEmojiAttributes } from '~~/config/emojis'

const props = defineProps<{
  status: mastodon.v1.Status
  details?: boolean
}>()

const { status } = useStatusActions(props)
function isCustomEmoji(emoji: mastodon.v1.FedibirdEmojiReaction) {
  return !!emoji.staticUrl
}

function emojiCode(emoji: mastodon.v1.FedibirdEmojiReaction) {
  return `:${emoji.name}:`
}
</script>

<template>
  <div flex flex-wrap gap-1 class="status-actions">
    <button
      v-for="(emoji, i) in status.emojiReactions ?? []"
      :key="i"
      flex gap-1 p="block-1 inline-2" text-secondary btn-base rounded-1
      :class="emoji.me ? 'b-1 b-primary bg-primary-fade' : 'b b-white bg-gray-1 hover:bg-gray-1 hover:b-gray'"
    >
      <picture v-if="isCustomEmoji(emoji)" class="custom-emoji" :data-emoji-id="emoji.name" :title="emojiCode(emoji)">
        <source :srcset="emoji.staticUrl" media="(prefers-reduced-motion: reduce)">
        <img :src="emoji.url" :alt="emojiCode(emoji)">
      </picture>
      <picture v-else class="custom-emoji" :data-emoji-id="emoji.name" :title="emojiCode(emoji)">
        <img v-bind="getEmojiAttributes(emoji.name)" :alt="emojiCode(emoji)">
      </picture>
      <CommonLocalizedNumber :keypath="emoji.count.toString()" :count="emoji.count" />
    </button>
  </div>
</template>
