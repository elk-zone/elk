<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.conversations'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <MainTitle as="router-link" to="/conversations" icon="i-ri:at-line">
        {{ t('nav.conversations') }}
      </MainTitle>
    </template>

    <TimelineConversations v-if="isHydrated" />
  </MainContent>
</template>
