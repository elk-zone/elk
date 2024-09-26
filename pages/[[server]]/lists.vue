<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.lists'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/lists" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:list-check />
        <span text-lg font-bold>{{ t('nav.lists') }}</span>
      </NuxtLink>
    </template>
    <NuxtPage v-if="isHydrated" />
  </MainContent>
</template>
