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
      to="/settings/profile/appearance"
    >
      <template #description>
        {{ $t('settings.profile.appearance.description') }}
      </template>
    </SettingsNavItem>
    <SettingsNavItem
      command
      icon="i-ri:hashtag"
      :text="$t('settings.profile.featured_tags.label')"
      to="/settings/profile/featured-tags"
    >
      <template #description>
        {{ $t('settings.profile.featured_tags.description') }}
      </template>
    </SettingsNavItem>
  </MainContent>
</template>
