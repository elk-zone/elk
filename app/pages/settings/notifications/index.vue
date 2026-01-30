<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const pwaEnabled = useAppConfig().pwaEnabled

useHydratedHead({
  title: () => `${t('settings.notifications.label')} | ${t('nav.settings')}`,
})
</script>

<template>
  <MainContent back="small-only">
    <template #title>
      <MainTitle as="h1" secondary>
        {{ $t('settings.notifications.label') }}
      </MainTitle>
    </template>

    <SettingsItem
      command
      :text="$t('settings.notifications.notifications.label')"
      to="/settings/notifications/notifications"
    />
    <SettingsItem
      command
      :disabled="!pwaEnabled"
      :text="$t('settings.notifications.push_notifications.label')"
      :description="$t('settings.notifications.push_notifications.description')"
      to="/settings/notifications/push-notifications"
    />
  </MainContent>
</template>
