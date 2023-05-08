<script setup lang="ts">
const { blurhash = '', src, srcset, shouldLoadImage = true } = defineProps<{
  blurhash?: string
  src: string
  srcset?: string
  shouldLoadImage?: boolean
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <UnLazyImage v-bind="$attrs" :blurhash="blurhash" :src="src" :src-set="srcset" :lazy-load="shouldLoadImage" auto-sizes />
</template>
