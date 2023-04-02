<script setup lang="ts">
defineProps<{
  max: number
  length: number
}>()
</script>

<template>
  <div dir="ltr" pointer-events-none pe-1 pt-2 text-sm tabular-nums text-secondary flex gap="0.5" :class="{ 'text-rose-500': length > max }">
    {{ length ?? 0 }}<span text-secondary-light>/</span><span text-secondary-light>{{ max }}</span>
  </div>
</template>
