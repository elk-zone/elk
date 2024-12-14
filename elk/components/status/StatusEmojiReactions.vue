<script setup lang="ts">
import type { akkoma } from 'akko'

const { status } = defineProps<{
  status: akkoma.v1.Status
}>()

const emojis = computed(() => status.emojiReactions
  .map(react => ({ count: react.count, url: react.url as string, shortcode: react.name, staticUrl: react.url as string, visibleInPicker: false }))
  .concat(status.favouritesCount > 0 ? [{ count: status.favouritesCount, url: '', staticUrl: '', shortcode: '👍', visibleInPicker: false }] : []),
)
</script>

<template>
  <div flex items-end gap-3 flex-row-reverse class="emojis">
    <div v-for="(emoji, index) in emojis" :key="emoji.shortcode" flex items-center gap-1 :style="{ transform: `translateX(${index * 15}px)` }">
      <img v-if="emoji.staticUrl" :src="emoji.staticUrl" :alt="emoji.shortcode" class="w-[20px] h-[20px]">
      <div v-else flex items-center class="w-[20px] h-[20px] text-[20px]">
        {{ emoji.shortcode }}
      </div>
      <div text-sm hidden class="counter">
        {{ emoji.count }}
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
    .emojis>div {
        transition: transform 0.2s ease;
    }
    .emojis:hover>div {
        transform: translateX(0) !important;
    }
    .emojis:hover>div>.counter {
        display: initial !important;
    }
</style>
