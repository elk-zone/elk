<script setup lang="ts">
const {
  background = 'transparent',
} = $defineProps<{
  background?: string
}>()
</script>

<template>
  <div fixed top-0 bottom-0 left-0 right-0 :style="{ background }" />
</template>
