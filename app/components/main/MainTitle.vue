<script setup lang="ts">
const { as = 'div' } = defineProps<{
  as?: string
  icon?: string
  secondary?: boolean
}>()

function doScroll({ currentTarget, metaKey, ctrlKey }: MouseEvent | KeyboardEvent) {
  // Ctrl+click or Command+click to open the link in a new tab
  // should not scroll the current tab's timeline
  if ((metaKey || ctrlKey) && (currentTarget as HTMLElement)?.nodeName === 'A') {
    return
  }
  useNuxtApp().$scrollToTop()
}
</script>

<template>
  <component
    :is="as"
    class="
      flex items-center gap-2 min-h-10 px-3
      text-start text-lg lh-tight font-bold cursor-pointer
    "
    :class="{ 'text-primary': !secondary }"
    @click="doScroll($event)"
  >
    <span v-if="icon" :class="icon" />
    <span min-w-8 line-clamp-2>
      <slot />
    </span>
  </component>
</template>
