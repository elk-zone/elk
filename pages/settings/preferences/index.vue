<script setup lang="ts">
const { t } = useI18n()

useHeadFixed({
  title: () => `${t('settings.preferences.label')} | ${t('nav.settings')}`,
})
</script>

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
      :checked="getFeatureFlag('experimentalVirtualScroller')"
      @click="toggleFeatureFlag('experimentalVirtualScroller')"
    >
      {{ $t('settings.feature_flags.virtual_scroll') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getFeatureFlag('experimentalGitHubCards')"
      @click="toggleFeatureFlag('experimentalGitHubCards')"
    >
      {{ $t('settings.feature_flags.github_cards') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getFeatureFlag('experimentalUserPicker')"
      @click="toggleFeatureFlag('experimentalUserPicker')"
    >
      {{ $t('settings.feature_flags.user_picker') }}
    </SettingsToggleItem>
  </MainContent>
</template>
