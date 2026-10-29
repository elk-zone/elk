<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue'

const { blurhash = '', shouldLoadImage = true, draggable = undefined } = defineProps<{
  blurhash?: string
  src: string
  srcset?: string
  shouldLoadImage?: boolean
  width?: ImgHTMLAttributes['width']
  height?: ImgHTMLAttributes['height']
  alt?: string
  draggable?: ImgHTMLAttributes['draggable']
}>()
</script>

<template>
  <UnLazyImage v-bind="{ width, height, alt, draggable }" :blurhash="blurhash" :src="src" :src-set="srcset" :lazy-load="shouldLoadImage" auto-sizes />
</template>
