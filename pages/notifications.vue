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

onActivated(() => {
  showSettings.value = false
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/notifications" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:notification-4-line />
        <span>{{ t('nav.notifications') }}</span>
      </NuxtLink>
    </template>

    <template v-if="pwaEnabled" #actions>
      <button
        flex rounded-4 p1
        hover:bg-active cursor-pointer transition-100
        :title="showSettings ? t('notification.settings.close_btn') : t('notification.settings.show_btn')"
        @click="showSettings = !showSettings"
      >
        <span aria-hidden="true" :class="showSettings ? 'i-ri:close-line' : 'i-ri:settings-line'" />
      </button>
    </template>

    <template #header>
      <CommonRouteTabs replace :options="tabs" />
    </template>

    <slot>
      <template v-if="pwaEnabled">
        <NotificationPreferences :show="showSettings" />
      </template>

      <NuxtPage />
    </slot>
  </MainContent>
</template>
