<script setup lang="ts">
import type { mastodon } from 'masto'

const { status } = defineProps<{
  status: mastodon.v1.Status
}>()

const cardHtml = $computed(() => status.card?.html ?? '')
const sanitizedHtml = ref(await sanitizeEmbeddedIframe(cardHtml))
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
