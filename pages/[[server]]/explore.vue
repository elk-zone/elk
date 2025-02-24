<script setup lang="ts">
import type { CommonRouteTabOption } from '~/types'

const { t } = useI18n()

const userSettings = useUserSettings()
const tabs = computed<CommonRouteTabOption[]>(() => [
  {
    to: isHydrated.value ? `/${currentServer.value}/explore` : '/explore',
    display: t('tab.posts'),
  },
  {
    to: isHydrated.value ? `/${currentServer.value}/explore/tags` : '/explore/tags',
    display: t('tab.hashtags'),
  },
  {
    to: isHydrated.value ? `/${currentServer.value}/explore/links` : '/explore/links',
    display: t('tab.news'),
    hide: userSettings.value.preferences.hideNews,
  },
  // This section can only be accessed after logging in
  {
    to: isHydrated.value ? `/${currentServer.value}/explore/users` : '/explore/users',
    display: t('tab.for_you'),
    disabled: !isHydrated.value || !currentUser.value,
  },
])

const useExplorePageForSearch = usePreferences('useExplorePageForSearch')
</script>

<template>
  <MainContent>
    <template #title>
      <span timeline-title-style flex items-center gap-2 cursor-pointer @click="$scrollToTop">
        <div i-ri:compass-3-line />
        <span>{{ t('nav.explore') }}</span>
      </span>
    </template>

    <template #header>
      <div v-if="useExplorePageForSearch" px2 mt3>
        <SearchWidget v-if="isHydrated" m-1 />
      </div>
      <CommonRouteTabs replace :options="tabs" />
    </template>
    <NuxtPage v-if="isHydrated" />
  </MainContent>
</template>
