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
      <section space-y-2>
        <h2 py2 font-bold text-xl flex="~ gap-1" items-center>
          {{ $t('settings.language.display_language') }}
        </h2>
        <div>
          {{ status }}
        </div>
        <SettingsLanguage select-settings />
        <NuxtLink
          href="https://docs.elk.zone/guide/contributing"
          target="_blank"
          hover:underline text-primary inline-flex items-center gap-1
        >
          <span inline-block i-ri:information-line />
          {{ $t('settings.language.how_to_contribute') }}
        </NuxtLink>
      </section>
      <section mt4>
        <h2 font-bold text-xl flex="~ gap-1" items-center>
          {{ $t('settings.language.post_language') }}
        </h2>
        <SettingsItem
          v-if="currentUser"
          command large
          icon="i-ri:quill-pen-line"
          :text="$t('settings.language.post_language')"
          :description="$t('settings.account_settings.description')"
          :to="`https://${currentUser!.server}/settings/preferences/other`"
          external target="_blank"
        />
      </section>
      <section>
        <h2 py4 mt2 font-bold text-xl flex="~ gap-1" items-center>
          {{ $t('settings.language.translations.heading') }}
        </h2>
        <SettingsTranslations />
      </section>
    </div>
  </MainContent>
</template>
