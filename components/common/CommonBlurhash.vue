<script setup lang="ts">
import { decode } from 'blurhash'

const { blurhash, src, srcset, shouldLoadImage = true } = defineProps<{
  blurhash?: string | null | undefined
  src: string
  srcset?: string
  shouldLoadImage?: boolean
}>()

defineOptions({
  inheritAttrs: false,
})

const isLoaded = ref(false)
const placeholderSrc = $computed(() => {
  if (!blurhash)
    return ''
  const pixels = decode(blurhash, 32, 32)
  return getDataUrlFromArr(pixels, 32, 32)
})

function loadImage() {
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
}

onMounted(() => {
  if (shouldLoadImage)
    loadImage()
})

watch(() => shouldLoadImage, () => {
  if (shouldLoadImage)
    loadImage()
})
</script>

<template>
  <img v-if="isLoaded || !placeholderSrc" v-bind="$attrs" :src="src" :srcset="srcset">
  <img v-else v-bind="$attrs" :src="placeholderSrc">
</template>
