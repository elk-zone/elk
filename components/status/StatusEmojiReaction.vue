<script setup lang="ts">
import type { mastodon } from 'masto'
import { getEmojiAttributes } from '~/config/emojis'

const props = defineProps<{
  status: mastodon.v1.Status
  details?: boolean
}>()

const { status }: { status: mastodon.v1.Status } = useStatusActions(props)
function isCustomEmoji(emoji: EmojiReaction) {
  return !!emoji.staticUrl
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
      <picture v-if="isCustomEmoji(emoji)" class="custom-emoji" :alt="`:${emoji.name}:`" :data-emoji-id="emoji.name">
        <source :srcset="emoji.staticUrl" media="(prefers-reduced-motion: reduce)">
        <img :src="emoji.url" :alt="`:${emoji.name}:`" title="" style="">
      </picture>
      <picture v-else class="custom-emoji" :alt="`:${emoji.name}:`" :data-emoji-id="emoji.name">
        <img v-bind="getEmojiAttributes(emoji.name)">
      </picture>
      <CommonLocalizedNumber :keypath="emoji.count.toString()" :count="emoji.count" />
    </button>
  </div>
</template>
