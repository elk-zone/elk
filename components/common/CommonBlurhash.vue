<script setup lang="ts">
import { decode } from 'blurhash'

const { blurhash, src, srcset } = defineProps<{
  blurhash?: string | null | undefined
  src: string
  srcset?: string
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
})
</script>

<template>
  <Transition>
    <img v-if="isLoaded || !placeholderSrc" v-bind="$attrs" :src="src" :srcset="srcset" absolute>
    <img v-else v-bind="$attrs" :src="placeholderSrc" absolute>
  </Transition>
  <img v-bind="$attrs" :src="placeholderSrc" z-0 aria-hidden>
</template>

<style>
.v-enter-active {
  transition: opacity 0.3s ease;
}

.v-enter-from {
  opacity: 0;
}
</style>
