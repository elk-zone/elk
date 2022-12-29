<template>
  <MainContent back-on-small-screen>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.profile.label') }}</span>
      </div>
    </template>

    <SettingsNavItem
      command
      icon="i-ri:user-settings-line"
      :text="$t('settings.profile.appearance.label')"
      :description="$t('settings.profile.appearance.description')"
      to="/settings/profile/appearance"
    />
    <SettingsNavItem
      command
      icon="i-ri:hashtag"
      :text="$t('settings.profile.featured_tags.label')"
      :description="$t('settings.profile.featured_tags.description')"
      to="/settings/profile/featured-tags"
    />
  </MainContent>
</template>
