<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.blocked_users'),
})
</script>

<template>
  <MainContent back skip-content="nav.blocked_users">
    <template #title>
      <span timeline-title-style>{{ $t('nav.blocked_users') }}</span>
    </template>

    <TimelineBlocks v-if="isHydrated" />
  </MainContent>
</template>
