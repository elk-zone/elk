<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = masto.accounts.getStatusesIterable(currentUser.value!.account.id, { pinned: true })

useHead({
  title: 'Pinned',
})
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:pushpin-line h-6 mr-1 />
      <span>Pinned</span>
    </template>

    <TimelinePaginator :paginator="paginator" />
  </MainContent>
</template>
