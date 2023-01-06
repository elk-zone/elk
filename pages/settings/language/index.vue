<script setup lang="ts">
const { t } = useI18n()

useHeadFixed({
  title: () => `${t('settings.language.label')} | ${t('nav.settings')}`,
})
</script>

<template>
  <MainContent back-on-small-screen>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.language.label') }}</span>
      </div>
    </template>
    <div p6>
      <label space-y-2>
        <p font-medium>{{ $t('settings.language.display_language') }}</p>
        <SettingsLanguage select-settings />
      </label>
    </div>
  </MainContent>
</template>
