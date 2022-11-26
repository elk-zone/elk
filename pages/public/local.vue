<script setup lang="ts">
const paginator = masto.timelines.getPublicIterable({ local: true })

useHead({
  title: 'Local',
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Local timeline</span>
    </template>

    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
