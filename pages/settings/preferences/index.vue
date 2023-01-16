<script setup lang="ts">
const { t } = useI18n()

useHeadFixed({
  title: () => `${t('settings.preferences.label')} | ${t('nav.settings')}`,
})

const userSettings = useUserSettings()
</script>

<template>
  <MainContent back-on-small-screen>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'hideBoostCount')"
      @click="togglePreferences('hideBoostCount')"
    >
      {{ $t('settings.preferences.hide_boost_count') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'hideFavoriteCount')"
      @click="togglePreferences('hideFavoriteCount')"
    >
      {{ $t('settings.preferences.hide_favorite_count') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'hideFollowerCount')"
      @click="togglePreferences('hideFollowerCount')"
    >
      {{ $t('settings.preferences.hide_follower_count') }}
    </SettingsToggleItem>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.preferences.label') }}</span>
      </div>
    </template>
    <h3 px6 py4 mt2 font-bold text-xl flex="~ gap-1" items-center>
      <div i-ri-flask-line />
      {{ $t('settings.preferences.title') }}
    </h3>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'experimentalVirtualScroller')"
      @click="togglePreferences('experimentalVirtualScroller')"
    >
      {{ $t('settings.preferences.virtual_scroll') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'experimentalGitHubCards')"
      @click="togglePreferences('experimentalGitHubCards')"
    >
      {{ $t('settings.preferences.github_cards') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'experimentalUserPicker')"
      @click="togglePreferences('experimentalUserPicker')"
    >
      {{ $t('settings.preferences.user_picker') }}
    </SettingsToggleItem>
  </MainContent>
</template>
