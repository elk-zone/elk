<script setup lang="ts">
const { blurhash = '', src, srcset } = defineProps<{
  blurhash?: string
  src: string
  srcset?: string
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <UnLazyImage v-bind="$attrs" :blurhash="blurhash" :src="src" :src-set="srcset" auto-sizes />
</template>
