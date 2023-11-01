<script setup lang="ts" generic="T, O, U = T">
import { onBeforeUnmount } from 'vue'

const {
  update = () => {},
} = defineProps<{
  update?: () => void
}>()

const interval = setInterval(() => {
  update()
}, 1000)

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<template>
  ⚡
</template>
