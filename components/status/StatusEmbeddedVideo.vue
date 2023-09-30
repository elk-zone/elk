<script setup lang="ts">
import type { mastodon } from 'masto'

const { status } = defineProps<{
  status: mastodon.v1.Status
}>()
</script>

<template>
  <div h-100 v-html="status.card?.html" />
</template>

<style>
iframe {
    width: 100%;
    height: 100%;
    border: none;
}
</style>
