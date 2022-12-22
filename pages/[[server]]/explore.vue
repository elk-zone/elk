<script setup lang="ts">
import { invoke } from '@vueuse/shared'

const { t } = useI18n()

const tabs = $computed(() => [
  {
    to: `/${currentServer.value}/explore`,
    display: t('tab.posts'),
  },
  {
    to: `/${currentServer.value}/explore/tags`,
    display: t('tab.hashtags'),
  },
  {
    to: `/${currentServer.value}/explore/links`,
    display: t('tab.news'),
  },
  // This section can only be accessed after logging in
  ...invoke(() => currentUser.value
    ? [
        {
          to: `/${currentServer.value}/explore/users`,
          display: t('tab.for_you'),
        },
      ]
    : [],
  ),
] as const)
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold flex items-center gap-2 cursor-pointer @click="$scrollToTop">
        <div i-ri:hashtag />
        <span>{{ t('nav_side.explore') }}</span>
      </span>
    </template>

    <template #header>
      <CommonRouteTabs replace :options="tabs" />
    </template>
    <NuxtPage v-if="isMastoInitialised" />
  </MainContent>
</template>
