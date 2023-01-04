<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHeadFixed({
  title: () => t('nav.blocked_domains'),
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ $t('nav.blocked_domains') }}</span>
    </template>

    <TimelineDomainBlocks v-if="isMastoInitialised" />
  </MainContent>
</template>
