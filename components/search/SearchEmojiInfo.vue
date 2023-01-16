<script setup lang="ts">
export interface SearchEmoji {
  title: string
  src: string
}

defineProps<{
  emoji: SearchEmoji
}>()
</script>

<template>
  <div flex="~ gap3" items-center text-base>
    <img
      width="20"
      height="20"
      :src="emoji.src"
      loading="lazy"
    >
    <span shrink overflow-hidden leading-none text-base><span text-secondary>:</span>{{ emoji.title }}<span text-secondary>:</span></span>
  </div>
</template>
