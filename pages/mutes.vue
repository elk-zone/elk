<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().mutes.getIterator()

useHead({
  title: 'Muted users',
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>Muted users</span>
    </template>
    <AccountPaginator :paginator="paginator" />
  </MainContent>
</template>
