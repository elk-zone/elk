<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHeadFixed({
  title: () => `${t('settings.notifications.notifications.label')} | ${t('nav.settings')}`,
})
</script>

<template>
  <MainContent back-on-small-screen>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.notifications.notifications.label') }}</span>
      </div>
    </template>

    <SettingsItem
      command
      :text="$t('settings.notifications.notifications.label')"
      to="/settings/notifications/notifications"
    />
    <SettingsItem
      command
      :text="$t('settings.notifications.push_notifications.label')"
      :description="$t('settings.notifications.push_notifications.description')"
      to="/settings/notifications/push-notifications"
    />
  </MainContent>
</template>
