<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
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
    <section>
      <h2 px6 py4 mt2 font-bold text-xl flex="~ gap-1" items-center sr-only>
        <span aria-hidden="true" block i-ri-equalizer-line />
        {{ $t('settings.preferences.label') }}
      </h2>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'hideAltIndicatorOnPosts')"
        @click="togglePreferences('hideAltIndicatorOnPosts')"
      >
        {{ $t('settings.preferences.hide_alt_indi_on_posts') }}
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'hideGifIndicatorOnPosts')"
        @click="togglePreferences('hideGifIndicatorOnPosts')"
      >
        {{ $t('settings.preferences.hide_gif_indi_on_posts') }}
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'hideAccountHoverCard')"
        @click="togglePreferences('hideAccountHoverCard')"
      >
        {{ $t('settings.preferences.hide_account_hover_card') }}
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'hideTagHoverCard')"
        @click="togglePreferences('hideTagHoverCard')"
      >
        {{ $t('settings.preferences.hide_tag_hover_card') }}
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'enableAutoplay')"
        :disabled="getPreferences(userSettings, 'enableDataSaving')"
        @click="togglePreferences('enableAutoplay')"
      >
        {{ $t('settings.preferences.enable_autoplay') }}
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'optimizeForLowPerformanceDevice')"
        @click="togglePreferences('optimizeForLowPerformanceDevice')"
      >
        {{ $t('settings.preferences.optimize_for_low_performance_device') }}
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'enableDataSaving')"
        @click="togglePreferences('enableDataSaving')"
      >
        {{ $t("settings.preferences.enable_data_saving") }}
        <template #description>
          {{ $t("settings.preferences.enable_data_saving_description") }}
        </template>
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'enablePinchToZoom')"
        @click="togglePreferences('enablePinchToZoom')"
      >
        {{ $t('settings.preferences.enable_pinch_to_zoom') }}
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'useStarFavoriteIcon')"
        @click="togglePreferences('useStarFavoriteIcon')"
      >
        {{ $t('settings.preferences.use_star_favorite_icon') }}
      </SettingsToggleItem>
    </section>
    <section>
      <h2 px6 py4 mt2 font-bold text-xl flex="~ gap-1" items-center>
        <span aria-hidden="true" block i-ri-hearts-line />
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
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'hideNews')"
        @click="togglePreferences('hideNews')"
      >
        {{ $t("settings.preferences.hide_news") }}
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'zenMode')"
        @click="togglePreferences('zenMode')"
      >
        {{ $t("settings.preferences.zen_mode") }}
        <template #description>
          {{ $t('settings.preferences.zen_mode_description') }}
        </template>
      </SettingsToggleItem>
    </section>
    <section>
      <h2 px6 py4 mt2 font-bold text-xl flex="~ gap-1" items-center>
        <span aria-hidden="true" block i-ri-flask-line />
        {{ $t('settings.preferences.title') }}
      </h2>
      <!-- Embedded Media -->
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'experimentalEmbeddedMedia')"
        @click="togglePreferences('experimentalEmbeddedMedia')"
      >
        {{ $t('settings.preferences.embedded_media') }}
        <template #description>
          {{ $t('settings.preferences.embedded_media_description') }}
        </template>
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'experimentalVirtualScroller')"
        @click="togglePreferences('experimentalVirtualScroller')"
      >
        {{ $t('settings.preferences.virtual_scroll') }}
        <template #description>
          {{ $t('settings.preferences.virtual_scroll_description') }}
        </template>
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'experimentalGitHubCards')"
        @click="togglePreferences('experimentalGitHubCards')"
      >
        {{ $t('settings.preferences.github_cards') }}
        <template #description>
          {{ $t('settings.preferences.github_cards_description') }}
        </template>
      </SettingsToggleItem>
      <SettingsToggleItem
        :checked="getPreferences(userSettings, 'experimentalUserPicker')"
        @click="togglePreferences('experimentalUserPicker')"
      >
        {{ $t('settings.preferences.user_picker') }}
        <template #description>
          {{ $t('settings.preferences.user_picker_description') }}
        </template>
      </SettingsToggleItem>
    </section>
  </MainContent>
</template>
