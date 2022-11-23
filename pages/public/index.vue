<script setup lang="ts">

const paginator = masto.timelines.getPublicIterable()
</script>

<template>
  <MainContent>
    <template #title>
  <span text-lg font-bold>Federated Timeline</span>
    </template>
    <template #actions>
      <div i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
