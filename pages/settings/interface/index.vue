<script setup lang="ts">
const { t } = useI18n()

useHeadFixed({
  title: () => `${t('settings.interface.label')} | ${t('nav.settings')}`,
})

const colorMode = useColorMode()
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
      <div v-if="colorMode.value === 'custom'" space-y-2>
        <p font-medium>
          Custom colors
        </p>
        <SettingsCustomColors />
      </div>
    </div>
  </MainContent>
</template>
