<script setup lang="ts">
const masto = await useMasto()
const { data: timelines } = await useAsyncData('public-timelines', () => masto.timelines.fetchPublic().then(r => r.value))
</script>

<template>
  <div w-120>
    <TimelineList :timelines="timelines" />
  </div>
</template>
