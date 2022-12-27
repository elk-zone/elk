<script lang="ts" setup>
const { lg } = breakpoints
</script>

<template>
  <MainContent :back="!lg">
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.preferences.label') }}</span>
      </div>
    </template>
    <h3 px6 py4 mt2 font-bold text-xl flex="~ gap-1" items-center>
      <div i-ri-flask-line />
      {{ $t('settings.feature_flags.title') }}
    </h3>
    <SettingsToggle
      :checked="currentUserFeatureFlags.experimentalVirtualScroll"
      @click="toggleFeatureFlag('experimentalVirtualScroll')"
    >
      {{ $t('settings.feature_flags.virtual_scroll') }}
    </SettingsToggle>
    <SettingsToggle
      :checked="currentUserFeatureFlags.experimentalAvatarOnAvatar"
      @click="toggleFeatureFlag('experimentalAvatarOnAvatar')"
    >
      {{ $t('settings.feature_flags.avatar_on_avatar') }}
    </SettingsToggle>
    <SettingsToggle
      :checked="currentUserFeatureFlags.experimentalGitHubCards"
      @click="toggleFeatureFlag('experimentalGitHubCards')"
    >
      {{ $t('settings.feature_flags.github_cards') }}
    </SettingsToggle>
    <SettingsToggle
      :checked="currentUserFeatureFlags.experimentalUserPicker"
      @click="toggleFeatureFlag('experimentalUserPicker')"
    >
      {{ $t('settings.feature_flags.user_picker') }}
    </SettingsToggle>
  </MainContent>
</template>
