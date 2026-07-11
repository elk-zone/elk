<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('account.pinned'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <MainTitle as="router-link" to="/pinned" icon="i-ri:pushpin-line">
        {{ t('account.pinned') }}
      </MainTitle>
    </template>

    <TimelinePinned v-if="isHydrated && currentUser" />
  </MainContent>
</template>
