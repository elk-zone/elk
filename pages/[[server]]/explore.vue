<script setup lang="ts">
import { invoke } from '@vueuse/shared'

const { t } = useI18n()

const tabs = $computed(() => [
  {
    to: `/${currentServer.value}/explore`,
    display: 'Posts',
  },
  {
    to: `/${currentServer.value}/explore/tags`,
    display: 'Hashtags',
  },
  {
    to: `/${currentServer.value}/explore/links`,
    display: 'News',
  },
  {
    to: `/${currentServer.value}/explore/users`,
    display: 'For you',
  },
] as const)

useHeadFixed({
  title: () => t('nav_side.explore'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/explore" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:hashtag />
        <span>{{ t('nav_side.explore') }}</span>
      </NuxtLink>
    </template>

    <template #header>
      <CommonRouteTabs replace :options="tabs" />
    </template>
    <NuxtPage />
  </MainContent>
</template>
