<script setup lang="ts">
import type { mastodon } from 'masto'

const { status, isPreview = false } = defineProps<{
  status: mastodon.v1.Status | mastodon.v1.StatusEdit
  fullSize?: boolean
  isPreview?: boolean
}>()

const gridColumnNumber = computed(() => {
  const num = status.mediaAttachments.length
  if (num <= 1)
    return 1
  else if (num <= 4)
    return 2
  else
    return 3
})
</script>

<template>
  <div class="status-media-container">
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
  --grid-cols: v-bind(gridColumnNumber);
  display: grid;
  grid-template-columns: repeat(var(--grid-cols, 1), 1fr);
  --at-apply: gap-2;
  position: relative;
  width: 100%;
  overflow: hidden;
}
</style>
