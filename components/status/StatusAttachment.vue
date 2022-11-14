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
      border="~ gray/10"
      object-cover rounded-lg
    >
  </template>
  <template v-else>
    <div>
      TODO: {{ attachment }}
    </div>
  </template>
</template>
