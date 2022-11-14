<script setup lang="ts">
import type { Attachment } from 'masto'

const { attachment } = defineProps<{
  attachment: Attachment
}>()
</script>

<template>
  <template v-if="attachment.type === 'image'">
    <img
      class="status-attachment-image"
      :src="attachment.previewUrl!"
      :alt="attachment.description!"
      rounded-lg border="~ gray/10"
    >
  </template>
  <template v-else>
    TODO: {{ attachment }}
  </template>
</template>
