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

const target = ref<HTMLImageElement | null>(null)
const targetIsVisible = ref(false)

function loadImage() {
  isLoaded.value = true
}

const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
  targetIsVisible.value = isIntersecting

  if (isIntersecting) {
    if (shouldLoadImage)
      loadImage()

    // Once the image is loaded, we don't need to observe it anymore
    stop()
  }
}, { threshold: 0.2 })

// If the loading is requested lazy from outside, we need to load the image
watch(() => shouldLoadImage, () => {
  if (shouldLoadImage)
    loadImage()
})
</script>

<template>
  <img v-if="isLoaded || !placeholderSrc" v-bind="$attrs" ref="target" loading="lazy" :src="src" :srcset="srcset">
  <img v-else v-bind="$attrs" ref="target" loading="lazy" :src="placeholderSrc">
</template>
