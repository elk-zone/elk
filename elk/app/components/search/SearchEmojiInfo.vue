<script setup lang="ts">
export interface SearchEmoji {
  title: string
  src?: string
  alt: string
}

defineProps<{
  emoji: SearchEmoji
}>()
</script>

<template>
  <div flex="~ gap3" items-center text-base>
    <img
      v-if="emoji.src"
      width="20"
      height="20"
      :alt="emoji.alt"
      :src="emoji.src"
      loading="lazy"
    >
    <span v-else class="text-[20px] leading-[20px]">
      {{ emoji.alt }}
    </span>
    <span shrink overflow-hidden leading-none text-base><span text-secondary>:</span>{{ emoji.title }}<span text-secondary>:</span></span>
  </div>
</template>
