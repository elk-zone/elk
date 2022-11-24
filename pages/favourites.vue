<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = masto.favourites.getIterator()
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Favourites</span>
    </template>
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
