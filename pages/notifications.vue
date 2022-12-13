<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const showSettings = ref(false)
const pwaEnabled = useRuntimeConfig().public.pwaEnabled

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
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/notifications" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:notification-4-line />
        <span>{{ t('nav_side.notifications') }}</span>
      </NuxtLink>
    </template>

    <template v-if="pwaEnabled" #actions>
      <button
        flex rounded-4 p2
        hover:bg-active cursor-pointer transition-100
        :title="$t(showSettings ? 'notification.settings.close_btn' : 'notification.settings.show_btn')"
        @click="showSettings = !showSettings"
      >
        <span aria-hidden="true" :class="showSettings ? 'i-ri:close-circle-line' : 'i-ri:settings-3-fill'" />
      </button>
    </template>

    <template #header>
      <CommonRouteTabs replace :options="tabs" />
    </template>
    <template v-if="pwaEnabled">
      <NotificationPreferences :show="showSettings" />
    </template>
    <NuxtPage :show="showSettings" />
  </MainContent>
</template>
