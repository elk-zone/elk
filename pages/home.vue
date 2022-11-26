<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().timelines.getHomeIterable()
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Home</span>
    </template>
    <slot>
      <PublishWidget draft-key="home" border="b base" />
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
