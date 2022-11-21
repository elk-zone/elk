<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()
</script>

<template>
  <div class="status-body">
    <CommonRichContent :content="status.content" />
  </div>
</template>
