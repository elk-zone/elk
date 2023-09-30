<script setup lang="ts">
import type { mastodon } from 'masto'

const { status } = defineProps<{
  status: mastodon.v1.Status
}>()

const sanitizedHtml = ref(await sanitizeEmbeddedIframe(status.card?.html || ''))
</script>

<template>
  <div v-if="sanitizedHtml" h-70 v-html="sanitizedHtml" />
</template>

<style>
iframe {
    width: 100%;
    height: 100%;
}
</style>
