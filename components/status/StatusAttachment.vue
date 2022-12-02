<script setup lang="ts">
import { clamp } from '@vueuse/core'
import type { Attachment } from 'masto'

const { attachment } = defineProps<{
  attachment: Attachment
  attachments?: Attachment[]
}>()

const src = $computed(() => attachment.previewUrl || attachment.url || attachment.remoteUrl!)
const srcset = $computed(() => [
  [attachment.url, attachment.meta?.original?.width],
  [attachment.previewUrl, attachment.meta?.small?.width],
].filter(([url]) => url).map(([url, size]) => `${url} ${size}w`).join(', '))

const rawAspectRatio = computed(() => {
  if (attachment.meta?.original?.aspect)
    return attachment.meta.original.aspect
  if (attachment.meta?.small?.aspect)
    return attachment.meta.small.aspect
  return undefined
})

const aspectRatio = computed(() => {
  if (rawAspectRatio.value)
    return clamp(rawAspectRatio.value, 0.5, 2)
  return undefined
})

const objectPosition = computed(() => {
  return [attachment.meta?.focus?.x, attachment.meta?.focus?.y]
    .map(v => v ? `${v * 100}%` : '50%')
    .join(' ')
})

const typeExtsMap = {
  video: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'mpg', 'mpeg'],
  audio: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'],
  image: ['jpg', 'jpeg', 'png', 'svg', 'webp', 'bmp'],
  gifv: ['gifv', 'gif'],
}

const type = $computed(() => {
  if (attachment.type && attachment.type !== 'unknown')
    return attachment.type
  // some server returns unknown type, we need to guess it based on file extension
  for (const [type, exts] of Object.entries(typeExtsMap)) {
    if (exts.some(ext => src?.toLowerCase().endsWith(`.${ext}`)))
      return type
  }
  return 'unknown'
})
</script>

<template>
  <template v-if="type === 'video'">
    <video
      :poster="attachment.previewUrl"
      controls
      border="~ base"
      object-cover
      :width="attachment.meta?.original?.width"
      :height="attachment.meta?.original?.height"
      :style="{
        aspectRatio,
        objectPosition,
      }"
    >
      <source :src="attachment.url || attachment.previewUrl" type="video/mp4">
    </video>
  </template>
  <template v-else-if="type === 'gifv'">
    <video
      :poster="attachment.previewUrl"
      loop
      autoplay
      border="~ base"
      object-cover
      :width="attachment.meta?.original?.width"
      :height="attachment.meta?.original?.height"
      :style="{
        aspectRatio,
        objectPosition,
      }"
    >
      <source :src="attachment.url || attachment.previewUrl" type="video/mp4">
    </video>
  </template>
  <template v-else-if="type === 'audio'">
    <audio controls border="~ base">
      <source :src="attachment.url || attachment.previewUrl" type="audio/mp3">
    </audio>
  </template>
  <template v-else>
    <button
      focus:outline-none
      focus:ring="2 primary inset"
      rounded-lg
      aria-label="Open image preview dialog"
      @click="openMediaPreview(attachments ? attachments : [attachment], attachments?.indexOf(attachment) || 0)"
    >
      <CommonBlurhash
        :blurhash="attachment.blurhash"
        class="status-attachment-image"
        :src="src"
        :srcset="srcset"
        :width="attachment.meta?.original?.width"
        :height="attachment.meta?.original?.height"
        :alt="attachment.description!"
        :style="{
          aspectRatio,
          objectPosition,
        }"
        border="~ base"
        rounded-lg
        h-full
        w-full
        object-cover
      />
    </button>
  </template>
</template>
