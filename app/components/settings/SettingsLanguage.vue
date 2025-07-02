<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'
import type { ComputedRef } from 'vue'

const userSettings = useUserSettings()

const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }
</script>

<template>
  <select v-model="userSettings.language">
    <option v-for="item in locales" :key="item.code" :value="item.code" :selected="userSettings.language === item.code">
      {{ item.name }}
    </option>
  </select>
</template>
