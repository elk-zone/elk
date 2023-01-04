<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHeadFixed({
  title: () => t('nav.muted_users'),
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ $t('nav.muted_users') }}</span>
    </template>

    <TimelineMutes v-if="isMastoInitialised" />
  </MainContent>
</template>
