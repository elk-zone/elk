<script setup lang="ts">
import type { Status } from 'masto'

defineProps<{
  status: Status
}>()
</script>

<template>
  <div flex justify-between gap-4>
    <button flex gap-1 justify-center items-center p1 w-full rounded hover="bg-gray/10">
      <div i-ri:chat-3-line />
      <span>{{ status.repliesCount }}</span>
    </button>
    <button flex gap-1 justify-center items-center p1 w-full rounded hover="bg-gray/10">
      <div i-ri:repeat-fill />
      <span>{{ status.reblogsCount }}</span>
    </button>
    <button flex gap-1 justify-center items-center p1 w-full rounded hover="bg-gray/10">
      <div i-ri:heart-3-line />
      <span>{{ status.favouritesCount }}</span>
    </button>
    <button flex gap-1 justify-center items-center p1 w-full rounded hover="bg-gray/10">
      <div i-ri:more-2-fill />
    </button>
  </div>
</template>
