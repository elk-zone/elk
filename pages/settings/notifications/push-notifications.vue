<script setup lang="ts">
const { t } = useI18n()

const pwaEnabled = useRuntimeConfig().public.pwaEnabled

useHeadFixed({
  title: () => `${t('settings.notifications.push_notifications_label')} | ${t('settings.notifications.label')} | ${t('nav.settings')}`,
})
</script>

<template>
  <MainContent back>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.notifications.push_notifications_label') }}</span>
      </div>
    </template>
    <template v-if="pwaEnabled">
      <NotificationPreferences show />
    </template>
  </MainContent>
</template>
