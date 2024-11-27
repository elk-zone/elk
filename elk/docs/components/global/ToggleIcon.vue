<script setup lang="ts">
const { up } = defineProps<{
  up?: boolean
}>()
</script>

<template>
  <svg v-if="up" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
    <path fill="currentColor" d="m12 10.828l-4.95 4.95l-1.414-1.414L12 8l6.364 6.364l-1.414 1.414z" />
  </svg>
  <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
    <path fill="currentColor" d="m12 13.172l4.95-4.95l1.414 1.414L12 16L5.636 9.636L7.05 8.222z" />
  </svg>
</template>
