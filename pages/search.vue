<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

const tabs = $computed(() => [
  {
    name: 'all',
    display: t('tab.notifications_all'),
  },
  {
    name: 'accounts',
    display: t('tab.accounts'),
  },
  {
    name: 'hashtags',
    display: t('tab.hashtags'),
  },
] as const)

const tab = $ref(tabs[0].name)

useHeadFixed({
  title: () => t('nav_side.search'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/search" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:search-2-line />
        <span>{{ t('nav_side.search') }}</span>
      </NuxtLink>
    </template>

    <template #header>
      <CommonTabs v-model="tab" :options="tabs" />
    </template>
    <slot>
      <!-- Display Search Results Here -->
    </slot>
  </MainContent>
</template>
