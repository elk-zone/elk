<script setup lang="ts">
definePageMeta({
  middleware: ['auth', () => {
    if (!useAppConfig().pwaEnabled)
      return navigateTo('/settings/notifications')
  }],
})

const { t } = useI18n()

useHydratedHead({
  title: () => `${t('settings.notifications.push_notifications.label')} | ${t('settings.notifications.label')} | ${t('nav.settings')}`,
})
</script>

<template>
  <MainContent back>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.notifications.push_notifications.label') }}</span>
      </div>
    </template>
    <NotificationPreferences show />
  </MainContent>
</template>
