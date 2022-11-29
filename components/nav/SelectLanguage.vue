<script lang="ts" setup>
import type { ComputedRef } from 'vue'
import type { LocaleObject } from '#i18n'
import { STORAGE_KEY_LANG } from '~/constants'

const { locale, t, setLocale } = useI18n()
const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }
useLocalStorage(STORAGE_KEY_LANG, locale)

const handleLocale = async (locale: string) => {
  await setLocale(locale)
}
</script>

<template>
  <CommonTooltip :content="t('nav_footer.select_language')">
    <CommonDropdown>
      <button flex :aria-label="t('nav_footer.select_language')">
        <div i-ri:earth-line text-lg />
      </button>

      <template #popper>
        <CommonDropdownItem
          v-for="item in locales"
          :key="item.code"
          :checked="item.code === locale"
          @click="handleLocale(item.code)"
        >
          {{ item.name }}
        </CommonDropdownItem>
      </template>
    </CommonDropdown>
  </CommonTooltip>
</template>
