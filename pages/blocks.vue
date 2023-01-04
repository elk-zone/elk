<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHeadFixed({
  title: () => t('nav.blocked_users'),
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ $t('nav.blocked_users') }}</span>
    </template>

    <TimelineBlocks v-if="isMastoInitialised" />
  </MainContent>
</template>
