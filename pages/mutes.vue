<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.muted_users'),
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span timeline-title-style>{{ $t('nav.muted_users') }}</span>
    </template>

    <TimelineMutes v-if="isHydrated" />
  </MainContent>
</template>
