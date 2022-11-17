<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const masto = await useMasto()
const paginator = masto.trends.getStatuses()
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:hashtag h-6 mr-1 /><span>Explore</span>
    </template>
    <template #actions>
      <div color-gray i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <!-- TODO: Tabs for trending statuses, tags, and links -->
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
