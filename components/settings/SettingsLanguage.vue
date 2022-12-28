<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import type { LocaleObject } from '#i18n'

const { locale, setLocale } = useI18n()
const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }
</script>

<template>
  <select :value="locale" @input="e => setLocale((e.target as any).value)">
    <option v-for="item in locales" :key="item.code" :value="item.code" :selected="locale === item.code">
      {{ item.name }}
    </option>
  </select>
</template>
