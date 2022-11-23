<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = masto.bookmarks.getIterator()
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Bookmarks</span>
    </template>
    <template #actions>
      <div i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
