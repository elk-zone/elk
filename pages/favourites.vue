<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const masto = await useMasto()
const paginator = masto.favourites.getIterator()
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:heart-fill h-6 mr-1 /><span>Favourites</span>
    </template>
    <template #actions>
      <div color-gray i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
