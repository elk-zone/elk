<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().favourites.getIterator()

useHead({
  title: 'Favourites',
})
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
