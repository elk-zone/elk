<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().blocks.getIterator()

useHead({
  title: 'Blocked users',
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ $t('account.blocked_users') }}</span>
    </template>
    <AccountPaginator :paginator="paginator" />
  </MainContent>
</template>
