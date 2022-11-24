<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()
</script>

<template>
  <div class="status-body">
    <ContentRich :content="status.content" :emojis="status.emojis" />
  </div>
</template>
