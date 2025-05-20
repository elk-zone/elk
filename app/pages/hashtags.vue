<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.hashtags'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/hashtags" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div class="i-ri:hashtag" />
        <span>{{ t('nav.hashtags') }}</span>
      </NuxtLink>
    </template>

    <NuxtPage v-if="isHydrated && currentUser" />
  </MainContent>
</template>
