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
      <NuxtLink to="/conversations" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:at-line />
        <span>{{ t('nav.conversations') }}</span>
      </NuxtLink>
    </template>

    <TimelineConversations v-if="isHydrated" />
  </MainContent>
</template>
