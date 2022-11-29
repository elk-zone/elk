<script lang="ts" setup>
import type { LocaleObject } from '@nuxtjs/i18n/dist/runtime/composables'
import type { ComputedRef } from 'vue'
import { STORAGE_KEY_LANG } from '~/constants'

const { locale, t } = useI18n()
useLocalStorage(STORAGE_KEY_LANG, locale)

const { locales } = useI18n() as { locales: ComputedRef<LocaleObject[]> }
</script>

<template>
  <CommonTooltip :content="t('nav_footer.select_language')">
    <CommonDropdown>
      <button flex>
        <div i-ri:earth-line text-lg />
      </button>

      <template #popper>
        <CommonDropdownItem
          v-for="item in locales"
          :key="item.code"
          :checked="item.code === locale"
          @click="locale = item.code"
        >
          {{ item.name }}
        </CommonDropdownItem>
      </template>
    </CommonDropdown>
  </CommonTooltip>
</template>
