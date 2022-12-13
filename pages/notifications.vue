<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

const tabs = $computed(() => [
  {
    name: 'all',
    to: '/notifications',
    display: t('tab.notifications_all'),
  },
  {
    name: 'mention',
    to: '/notifications/mention',
    display: t('tab.notifications_mention'),
  },
] as const)

useHeadFixed({
  title: () => t('nav_side.notifications'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/notifications" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:notification-4-line />
        <span>{{ t('nav_side.notifications') }}</span>
      </NuxtLink>
    </template>

    <template #header>
      <CommonRouteTabs replace :options="tabs" />
    </template>
    <NuxtPage />
    <!--
    <slot>
      <NotificationPaginator :key="tab" v-bind="{ paginator, stream }" />
    </slot>
-->
  </MainContent>
</template>
