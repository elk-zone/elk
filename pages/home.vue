<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = masto.timelines.getHomeIterable()
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:home-fill h-6 mr-1 /><span>Home</span>
    </template>
    <template #actions>
      <div color-gray i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
