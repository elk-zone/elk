<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import ISO6391 from 'iso-639-1'
import type { LocaleObject } from '#i18n'

const userSettings = useUserSettings()

const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }

// Find English name from language code (e.g. 'ja-JP' -> 'Japanese')
function getEnglishName(langCode: string): string {
  return ISO6391.getName(langCode.split('-')[0])
}
</script>

<template>
  <select v-model="userSettings.language">
    <option v-for="item in locales" :key="item.code" :value="item.code" :selected="userSettings.language === item.code">
      {{ getEnglishName(item.code) }} - {{ item.name }}
    </option>
  </select>
</template>
