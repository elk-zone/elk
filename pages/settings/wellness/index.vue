<script setup lang="ts">
const { t } = useI18n()

useHeadFixed({
  title: () => `${t('settings.wellness.label')} | ${t('nav.settings')}`,
})
</script>

<template>
  <MainContent back-on-small-screen>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.wellness.label') }}</span>
      </div>
    </template>
    <SettingsToggleItem
      :checked="getWellnessSetting('hideBoostCount')"
      @click="toggleWellnessSetting('hideBoostCount')"
    >
      {{ $t('settings.wellness.feature.hide_boost_count') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getWellnessSetting('hideFavoriteCount')"
      @click="toggleWellnessSetting('hideFavoriteCount')"
    >
      {{ $t('settings.wellness.feature.hide_favorite_count') }}
    </SettingsToggleItem>
    <SettingsToggleItem
      :checked="getWellnessSetting('hideFollowerCount')"
      @click="toggleWellnessSetting('hideFollowerCount')"
    >
      {{ $t('settings.wellness.feature.hide_follower_count') }}
    </SettingsToggleItem>
  </MainContent>
</template>
