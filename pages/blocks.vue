<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

useHeadFixed({
  title: 'Blocked users',
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ $t('account.blocked_users') }}</span>
    </template>

    <TimelineBlocks v-if="isMastoInitialised" />
  </MainContent>
</template>
