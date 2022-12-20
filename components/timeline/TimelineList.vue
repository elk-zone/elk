<script setup lang="ts">
import type { Status } from 'masto/fetch'

defineProps<{
  timelines: Status[]
}>()
</script>

<template>
  <template v-for="status of timelines" :key="status.id">
    <StatusCard :status="status" border="t base" />
  </template>
</template>
