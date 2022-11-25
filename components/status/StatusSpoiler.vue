<script setup lang="ts">
const props = defineProps<{ enabled: boolean }>()
defineSlots<'spoiler'>()

const [showContent, toggleContent] = $(useToggle(!props.enabled))
</script>

<template>
  <div v-if="enabled" flex flex-col items-start gap-2>
    <slot name="spoiler" />
    <button btn-outline px-2 py-1 text-3 @click="toggleContent()">
      {{ showContent ? 'Show less' : 'Show more' }}
    </button>
  </div>
  <slot v-if="showContent" />
</template>
