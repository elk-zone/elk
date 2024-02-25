<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => `${t('settings.profile.label')} | ${t('nav.settings')}`,
})
</script>

<template>
  <MainContent back-on-small-screen>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.profile.label') }}</span>
      </div>
    </template>

    <SettingsItem
      command large
      icon="i-ri:user-settings-line"
      :text="$t('settings.profile.appearance.label')"
      :description="$t('settings.profile.appearance.description')"
      to="/settings/profile/appearance"
    />
    <SettingsItem
      command large
      icon="i-ri:hashtag"
      :text="$t('settings.profile.featured_tags.label')"
      :description="$t('settings.profile.featured_tags.description')"
      to="/settings/profile/featured-tags"
    />
    <SettingsItem
      v-if="isHydrated && currentUser"
      command large
      icon="i-ri:settings-line"
      :text="$t('settings.account_settings.label')"
      :description="$t('settings.account_settings.description')"
      :to="`https://${currentUser!.server}/auth/edit`"
      external target="_blank"
    />
  </MainContent>
</template>
