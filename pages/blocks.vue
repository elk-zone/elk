<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = $computed(() => useMasto()?.blocks?.iterate?.())

useHeadFixed({
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
