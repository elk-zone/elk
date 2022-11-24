<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = masto.timelines.getHomeIterable()
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Home</span>
    </template>
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
