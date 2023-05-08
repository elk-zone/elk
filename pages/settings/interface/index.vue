<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
  title: () => `${t('settings.interface.label')} | ${t('nav.settings')}`,
})
</script>

<template>
  <MainContent back-on-small-screen>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.interface.label') }}</span>
      </div>
    </template>
    <div p6 flex="~ col gap6">
      <label space-y-2>
        <p font-medium>{{ $t('settings.interface.font_size') }}</p>
        <SettingsFontSize select-settings />
      </label>
      <div space-y-2>
        <p font-medium>
          {{ $t('settings.interface.color_mode') }}
        </p>
        <SettingsColorMode />
      </div>
      <div space-y-2>
        <p font-medium>
          {{ $t('settings.interface.theme_color') }}
        </p>
        <SettingsThemeColors />
      </div>
    </div>
  </MainContent>
</template>
