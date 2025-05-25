<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const { blurhash = '', shouldLoadImage = true } = defineProps<{
  blurhash?: string
  src: string
  srcset?: string
  shouldLoadImage?: boolean
}>()
</script>

<template>
  <UnLazyImage v-bind="$attrs" :blurhash="blurhash" :src="src" :src-set="srcset" :lazy-load="shouldLoadImage" auto-sizes />
</template>
