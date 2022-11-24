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

    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
