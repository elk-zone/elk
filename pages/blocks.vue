<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = masto.blocks.getIterator()

useHead({
  title: 'Blocked users',
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>Blocked users</span>
    </template>
    <AccountPaginator :paginator="paginator" />
  </MainContent>
</template>
