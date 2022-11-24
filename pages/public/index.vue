<script setup lang="ts">

const paginator = masto.timelines.getPublicIterable()
</script>

<template>
  <MainContent>
    <template #title>
  <span text-lg font-bold>Federated Timeline</span>
    </template>
    
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
