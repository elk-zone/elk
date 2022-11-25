<script setup lang="ts">
const paginator = masto.trends.getStatuses()

useHead({
  title: 'Explore',
})
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:hashtag h-6 mr-1 /><span>Explore</span>
    </template>

    <slot>
      <!-- TODO: Tabs for trending statuses, tags, and links -->
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
