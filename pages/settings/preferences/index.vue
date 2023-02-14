<script setup lang="ts">
const { t } = useI18n()

useHeadFixed({
  title: () => `${t('settings.preferences.label')} | ${t('nav.settings')}`,
})

const userSettings = useUserSettings()
</script>

<template>
  <MainContent back-on-small-screen>
    <template #title>
      <h1 text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        {{ $t('settings.preferences.label') }}
      </h1>
    </template>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'hideAltIndicatorOnPosts')"
      @click="togglePreferences('hideAltIndicatorOnPosts')"
    >
      {{ $t('settings.preferences.hide_alt_indi_on_posts') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'hideAccountHoverCard')"
      @click="togglePreferences('hideAccountHoverCard')"
    >
      {{ $t('settings.preferences.hide_account_hover_card') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'enableAutoplay')"
      @click="togglePreferences('enableAutoplay')"
    >
      {{ $t('settings.preferences.enable_autoplay') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'enablePinchToZoom')"
      @click="togglePreferences('enablePinchToZoom')"
    >
      {{ $t('settings.preferences.enable_pinch_to_zoom') }}
    </SettingsToggleItem>
    <h2 px6 py4 mt2 font-bold text-xl flex="~ gap-1" items-center>
      <div i-ri-hearts-line />
      {{ $t('settings.preferences.wellbeing') }}
    </h2>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'grayscaleMode')"
      @click="togglePreferences('grayscaleMode')"
    >
      {{ $t('settings.preferences.grayscale_mode') }}
    </SettingsToggleItem>
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
      :checked="getPreferences(userSettings, 'hideReplyCount')"
      @click="togglePreferences('hideReplyCount')"
    >
      {{ $t('settings.preferences.hide_reply_count') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'hideFollowerCount')"
      @click="togglePreferences('hideFollowerCount')"
    >
      {{ $t('settings.preferences.hide_follower_count') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'hideUsernameEmojis')"
      @click="togglePreferences('hideUsernameEmojis')"
    >
      {{ $t("settings.preferences.hide_username_emojis") }}
      <template #description>
        {{ $t('settings.preferences.hide_username_emojis_description') }}
      </template>
    </SettingsToggleItem>
    <h2 px6 py4 mt2 font-bold text-xl flex="~ gap-1" items-center>
      <div i-ri-flask-line />
      {{ $t('settings.preferences.title') }}
    </h2>
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
