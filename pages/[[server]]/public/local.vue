<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
  title: () => t('title.local_timeline'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/public/local" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:group-2-line />
        <span>{{ t('title.local_timeline') }}</span>
      </NuxtLink>
    </template>

    <TimelinePublicLocal v-if="isHydrated" />
  </MainContent>
</template>
