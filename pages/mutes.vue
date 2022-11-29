<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().mutes.getIterator()

useHeadFixed({
  title: 'Muted users',
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ $t('account.muted_users') }}</span>
    </template>
    <AccountPaginator :paginator="paginator" />
  </MainContent>
</template>
