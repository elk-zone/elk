<script setup lang="ts">
const masto = await useMasto()
const { data: timelines } = await useAsyncData('timelines-public', () => masto.timelines.fetchPublic().then(r => r.value))
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:earth-fill h-6 mr-1 /><span>Federated Timeline</span>
    </template>
    <template #actions>
      <div color-gray i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <TimelineList :timelines="timelines" />
    </slot>
  </MainContent>
</template>
