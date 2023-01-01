<template>
  <MainContent back-on-small-screen>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.preferences.label') }}</span>
      </div>
    </template>
    <h3 px6 py4 mt2 font-bold text-xl flex="~ gap-1" items-center>
      <div i-ri-flask-line />
      {{ $t('settings.feature_flags.title') }}
    </h3>
    <SettingsToggleItem
      :checked="currentUserFeatureFlags.experimentalVirtualScroll"
      @click="toggleFeatureFlag('experimentalVirtualScroll')"
    >
      {{ $t('settings.feature_flags.virtual_scroll') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="currentUserFeatureFlags.experimentalGitHubCards"
      @click="toggleFeatureFlag('experimentalGitHubCards')"
    >
      {{ $t('settings.feature_flags.github_cards') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="currentUserFeatureFlags.experimentalUserPicker"
      @click="toggleFeatureFlag('experimentalUserPicker')"
    >
      {{ $t('settings.feature_flags.user_picker') }}
    </SettingsToggleItem>
  </MainContent>
</template>
