<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})
useHeadFixed({
  title: 'Muted users',
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ $t('account.muted_users') }}</span>
    </template>

    <TimelineMutes v-if="isMastoInitialised" />
  </MainContent>
</template>
