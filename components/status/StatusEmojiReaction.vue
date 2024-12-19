<script setup lang="ts">
import { getEmojiAttributes } from '~/config/emojis'

const props = defineProps<{
  status: Status
  details?: boolean
}>()

const {
  status,
} = useStatusActions(props)

function isCustomEmoji(emoji: EmojiReaction) {
  return !!emoji.staticUrl
}
</script>

<template>
  <div flex flex-wrap gap-1 class="status-actions">
    <button
      v-for="(emoji, i) in status?.emojiReactions ?? []"
      :key="i"
      flex gap-1 p="block-1 inline-2" text-secondary btn-base hover:bg-gray-1 rounded-1
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
