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
    <div px-6 pt-3 pb-6 flex="~ col gap6">
      <SettingsFontSize space-y-2 />
      <SettingsColorMode space-y-2 />
      <SettingsThemeColors space-y-2 />
      <SettingsBottomNav space-y-2 />
    </div>
  </MainContent>
</template>
