<script setup lang="ts">
const { t } = useI18n()

const tabs = $computed(() => [
  {
    to: isHydrated.value ? `/${currentServer.value}/explore` : '/explore',
    display: isHydrated.value ? t('tab.posts') : '',
  },
  {
    to: isHydrated.value ? `/${currentServer.value}/explore/tags` : '/explore/tags',
    display: isHydrated.value ? t('tab.hashtags') : '',
  },
  {
    to: isHydrated.value ? `/${currentServer.value}/explore/links` : '/explore/links',
    display: isHydrated.value ? t('tab.news') : '',
  },
  // This section can only be accessed after logging in
  {
    to: isHydrated.value ? `/${currentServer.value}/explore/users` : '/explore/users',
    display: isHydrated.value ? t('tab.for_you') : '',
    disabled: !isHydrated.value || !currentUser.value,
  },
] as const)
</script>

<template>
  <MainContent no-overflow-hidden :back-on-small-screen="isExtraLargeScreen">
    <template #title>
      <SearchWidget ref="search" class="m-1" />
    </template>

    <template #header>
      <CommonRouteTabs replace :options="tabs" />
    </template>
    <NuxtPage v-if="isHydrated" />
  </MainContent>
</template>
