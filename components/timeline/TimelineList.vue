<script setup lang="ts">
import type { mastodon } from 'masto'

defineProps<{
  timelines: mastodon.v1.Status[]
}>()
</script>

<template>
  <template v-for="status of timelines" :key="status.id">
    <StatusCard :status="status" border="t base" />
  </template>
</template>
