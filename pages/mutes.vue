<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = $computed(() => useMasto()?.mutes?.iterate?.())

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
