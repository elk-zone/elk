<script setup lang="ts">
import { decode } from 'blurhash'

const { blurhash, src, srcset } = defineProps<{
  blurhash: string
  src: string
  srcset?: string
}>()

defineOptions({
  inheritAttrs: false,
})

const placeholderSrc = ref<string>()
const isLoaded = ref(false)

onMounted(() => {
  const img = document.createElement('img')

  img.onload = () => {
    isLoaded.value = true
  }

  img.src = src

  if (srcset)
    img.srcset = srcset

  setTimeout(() => {
    isLoaded.value = true
  }, 3_000)

  if (blurhash) {
    const pixels = decode(blurhash, 32, 32)
    placeholderSrc.value = getDataUrlFromArr(pixels, 32, 32)
  }
})
</script>

<template>
  <img v-if="isLoaded || !placeholderSrc" v-bind="$attrs" :src="src" :srcset="srcset">
  <img v-else v-bind="$attrs" :src="placeholderSrc">
</template>
