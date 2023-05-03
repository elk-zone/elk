<script setup lang="ts">
const { t } = useI18n()

const nativeSettings = (await useNativeSettings())!

useHydratedHead({
  title: () => `${t('settings.native.label')} | ${t('nav.settings')}`,
})

definePageMeta({
  validate() {
    return !!import.meta.env.TAURI_PLATFORM
  },
})
</script>

<template>
  <MainContent back-on-small-screen>
    <template #title>
      <h1 text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        {{ $t('settings.native.label') }}
      </h1>
    </template>
    <SettingsToggleItem
      :checked="nativeSettings.minimizeToTray.value"
      @click="nativeSettings.minimizeToTray.value = !nativeSettings.minimizeToTray.value"
    >
      {{ $t('settings.native.minimize_to_tray') }}
    </SettingsToggleItem>
  </MainContent>
</template>
