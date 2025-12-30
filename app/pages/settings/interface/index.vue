<script setup lang="ts">
const { t } = useI18n()

useHydratedHead({
  title: () => `${t('settings.interface.label')} | ${t('nav.settings')}`,
})
</script>

<template>
  <MainContent back="small-only">
    <template #title>
      <MainTitle as="h1" secondary>
        {{ $t('settings.interface.label') }}
      </MainTitle>
    </template>
    <div px-6 pt-3 pb-6 flex="~ col gap6">
      <SettingsFontSize />
      <SettingsColorMode />
      <SettingsThemeColors />
      <SettingsBottomNav />
    </div>
  </MainContent>
</template>
