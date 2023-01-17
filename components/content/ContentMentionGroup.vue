<script setup lang="ts">
defineProps<{
  replying?: boolean
}>()
</script>

<template>
  <p flex="~ gap-1 wrap" items-center text-sm :class="{ 'zen-none': !replying }">
    <span i-ri-arrow-right-line ml--1 text-secondary-light /><slot />
  </p>
</template>
