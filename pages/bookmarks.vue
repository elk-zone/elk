<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const masto = await useMasto()
const paginator = masto.bookmarks.getIterator()
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:bookmark-fill h-6 mr-1 /><span>Bookmarks</span>
    </template>
    <template #actions>
      <div color-gray i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
