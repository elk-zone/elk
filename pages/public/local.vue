<script setup lang="ts">
const { data: timelines } = await useAsyncData('timelines-home', () => masto.timelines.fetchPublic({ local: true }).then(r => r.value))
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Local timeline</span>
    </template>
    <template #actions>
      <div i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <TimelineList :timelines="timelines" />
    </slot>
  </MainContent>
</template>
