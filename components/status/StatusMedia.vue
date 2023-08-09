<script setup lang="ts">
import type { mastodon } from 'masto'

const { status, isPreview = false } = defineProps<{
  status: mastodon.v1.Status | mastodon.v1.StatusEdit
  fullSize?: boolean
  isPreview?: boolean
}>()
</script>

<template>
  <div class="status-media-container" :class="`status-media-container-${status.mediaAttachments.length}`">
    <template v-for="attachment of status.mediaAttachments" :key="attachment.id">
      <StatusAttachment
        :attachment="attachment"
        :attachments="status.mediaAttachments"
        :full-size="fullSize"
        w-full
        h-full
        :is-preview="isPreview"
      />
    </template>
  </div>
</template>

<style lang="postcss">
.status-media-container {
  --at-apply: gap-2;
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
