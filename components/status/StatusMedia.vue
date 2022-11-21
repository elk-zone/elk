<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()
</script>

<template>
  <div class="status-media-container" :class="`status-media-container-${status.mediaAttachments.length}`">
    <template v-for="attachment of status.mediaAttachments" :key="attachment.id">
      <StatusAttachment :attachment="attachment" class="w-full h-full" />
    </template>
  </div>
</template>

<style lang="postcss">
.status-media-container {
  --at-apply: gap-0.5;
  position: relative;
  width: 100%;
  overflow: hidden;
}
.status-media-container-1 {
  display: grid;
  grid-template-columns: 1fr;
}
.status-media-container-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.status-media-container-3 {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
.status-media-container-4 {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
