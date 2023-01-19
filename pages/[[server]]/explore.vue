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
  <MainContent>
    <template #title>
      <span timeline-title-style flex items-center gap-2 cursor-pointer @click="$scrollToTop">
        <div i-ri:hashtag />
        <span>{{ t('nav.explore') }}</span>
      </span>
    </template>

    <template #header>
      <CommonRouteTabs replace :options="tabs" />
    </template>
    <NuxtPage v-if="isHydrated" />
  </MainContent>
</template>
