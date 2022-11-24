<script setup lang="ts">
const { data: timelines } = await useAsyncData('timelines-home', () => masto.timelines.fetchPublic({ local: true }).then(r => r.value))
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Local timeline</span>
    </template>
    
    <slot>
      <TimelineList :timelines="timelines" />
    </slot>
  </MainContent>
</template>
