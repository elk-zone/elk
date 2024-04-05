<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.blocked_domains'),
})
</script>

<template>
  <MainContent back skip-content="nav.blocked_domains">
    <template #title>
      <span timeline-title-style>{{ $t('nav.blocked_domains') }}</span>
    </template>

    <TimelineDomainBlocks v-if="isHydrated" />
  </MainContent>
</template>
