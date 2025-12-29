<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.bookmarks'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <MainTitle as="router-link" to="/bookmarks" icon="i-ri:bookmark-line">
        {{ t('nav.bookmarks') }}
      </MainTitle>
    </template>

    <TimelineBookmarks v-if="isHydrated" />
  </MainContent>
</template>
