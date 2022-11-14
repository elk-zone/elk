<script setup lang="ts">
const masto = await useMasto()
const { data: timelines } = await useAsyncData('timelines-public', () => masto.timelines.fetchPublic().then(r => r.value))
</script>

<template>
  <TimelineList :timelines="timelines" />
</template>
