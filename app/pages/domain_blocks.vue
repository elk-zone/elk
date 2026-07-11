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
  <MainContent back>
    <template #title>
      <MainTitle>{{ $t('nav.blocked_domains') }}</MainTitle>
    </template>

    <TimelineDomainBlocks v-if="isHydrated" />
  </MainContent>
</template>
