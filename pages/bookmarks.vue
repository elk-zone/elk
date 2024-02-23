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
      <NuxtLink to="/bookmarks" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:bookmark-line />
        <span>{{ t('nav.bookmarks') }}</span>
      </NuxtLink>
    </template>

    <TimelineBookmarks v-if="isHydrated" />
  </MainContent>
</template>
