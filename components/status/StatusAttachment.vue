<script setup lang="ts">
import type { Attachment } from 'masto'

const { attachment } = defineProps<{
  attachment: Attachment
}>()

const aspectRatio = computed(() => {
  if (attachment.meta?.original?.aspect)
    return attachment.meta.original.aspect
  if (attachment.meta?.small?.aspect)
    return attachment.meta.small.aspect
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
      border="~ border"
      :style="{
        aspectRatio,
      }"
      object-cover rounded-lg
    />
  </template>
  <template v-else>
    TODO:
    <pre>{{ attachment }}
    </pre>
  </template>
</template>
