<script setup lang="ts">
const props = defineProps<{
  icon: string
}>()
</script>

<template>
  <div :class="props.icon" w="[22.5px]" h="[22.5px]" text-xl />
</template>
