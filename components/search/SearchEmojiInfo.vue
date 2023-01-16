<script setup lang="ts">
import { Emoji } from 'emoji-mart'

export interface SearchEmoji {
  title: string
  src: string
}

defineProps<{
  emoji: SearchEmoji
}>()
</script>

<template>
  <div flex gap-2 items-center>
    <img
      :key="emoji.title"
      width="30"
      height="30"
      :src="emoji.src"
      loading="lazy"
    >
    <div flex="~ col gap1" pt-1 pl-2 shrink h-full overflow-hidden leading-none>
      <div flex="~" gap-2>
        <span text-lg>:{{ emoji.title }}:</span>
      </div>
    </div>
  </div>
</template>
