<script setup lang="ts">
import { clamp } from '@vueuse/core'
import type { Attachment } from 'masto'

const { attachment } = defineProps<{
  attachment: Attachment
}>()

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
  <template v-if="attachment.type === 'image' || attachment.type === 'gifv'">
    <CommonBlurhash
      :blurhash="attachment.blurhash"
      class="status-attachment-image"
      :src="attachment.previewUrl!"
      :alt="attachment.description!"
      :style="{
        aspectRatio,
      }"
      border="~ border"
      object-cover rounded-lg
    />
  </template>
  <template v-else-if="attachment.type === 'video'">
    <video
      :poster="attachment.previewUrl"
      controls
      border="~ border"
      object-cover
      :style="{
        aspectRatio,
      }"
    >
      <source :src="attachment.url || attachment.previewUrl" type="video/mp4">
    </video>
  </template>
  <template v-else>
    TODO:
    <pre>{{ attachment }}
    </pre>
  </template>
</template>
