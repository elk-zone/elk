<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import type { LocaleObject } from '#i18n'

const props = defineProps<{
  language?: string
}>()
const model = useVModel(props, 'language')

const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }
</script>

<template>
  <select v-model="model">
    <option v-for="item in locales" :key="item.code" :value="item.code" :selected="props.language === item.code">
      {{ item.name }}
    </option>
  </select>
</template>
