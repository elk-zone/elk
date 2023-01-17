<script setup lang="ts">
defineProps<{
  showInZenMode?: boolean
}>()
</script>

<template>
  <p flex="~ gap-1 wrap" items-center text-sm :class="{ 'zen-none': !showInZenMode }">
    <span i-ri-arrow-right-line ml--1 text-secondary-light /><slot />
  </p>
</template>
