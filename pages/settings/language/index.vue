<script setup lang="ts">
import type { ElkTranslationStatus } from '~/types/translation-status'

const { t, locale } = useI18n()

const translationStatus: ElkTranslationStatus = await import('~/elk-translation-status.json').then(m => m.default)

useHydratedHead({
  title: () => `${t('settings.language.label')} | ${t('nav.settings')}`,
})
const status = computed(() => {
  const entry = translationStatus.locales[locale.value]
  return t('settings.language.status', [entry.total, translationStatus.total, entry.percentage])
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
        <span block font-medium>{{ $t('settings.language.display_language') }}</span>
        <span block>
          {{ status }}
        </span>
        <SettingsLanguage select-settings />
      </label>
      <h2 py4 mt2 font-bold text-xl flex="~ gap-1" items-center>
        {{ $t('settings.language.translations.heading') }}
      </h2>
      <SettingsTranslations />
    </div>
  </MainContent>
</template>
