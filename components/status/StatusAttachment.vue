<script setup lang="ts">
import { clamp } from '@vueuse/core'
import type { Attachment } from 'masto'

const { attachment } = defineProps<{
  attachment: Attachment
}>()

const src = $computed(() => attachment.remoteUrl || attachment.url || attachment.previewUrl!)

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
</script>

<template>
  <template v-if="attachment.type === 'video'">
    <video
      :poster="attachment.previewUrl"
      controls
      border="~ base"
      object-cover
      :style="{
        aspectRatio,
      }"
    >
      <source :src="attachment.url || attachment.previewUrl" type="video/mp4">
    </video>
  </template>
  <template v-else-if="attachment.type === 'gifv'">
    <video
      :poster="attachment.previewUrl"
      loop
      autoplay
      border="~ base"
      object-cover
      :style="{
        aspectRatio,
      }"
    >
      <source :src="attachment.url || attachment.previewUrl" type="video/mp4">
    </video>
  </template>
  <template v-else-if="attachment.type === 'audio'">
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
      @click="openImagePreviewDialog({
        src,
        alt: attachment.description!,
      })"
    >
      <CommonBlurhash
        :blurhash="attachment.blurhash"
        class="status-attachment-image"
        :src="src"
        :alt="attachment.description!"
        :style="{
          aspectRatio,
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
