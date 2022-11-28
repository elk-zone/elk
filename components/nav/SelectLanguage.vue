<script lang="ts" setup>
import { STORAGE_KEY_LANG } from '~/constants'

const { locale, t } = useI18n()
useLocalStorage(STORAGE_KEY_LANG, locale)

// TODO: read from $i18n https://i18n.nuxtjs.org/lang-switcher
const languageList = [
  {
    value: 'en-US',
    label: 'English',
  },
  {
    value: 'zh-CN',
    label: '简体中文',
  },
]
</script>

<template>
  <CommonTooltip placement="bottom" :content="t('selectLanguage')">
    <CommonDropdown>
      <button flex>
        <div i-ri:earth-line text-lg />
      </button>

      <template #popper>
        <CommonDropdownItem
          v-for="item in languageList"
          :key="item.value"
          :checked="item.value === locale"
          @click="locale = item.value"
        >
          {{ item.label }}
        </CommonDropdownItem>
      </template>
    </CommonDropdown>
  </CommonTooltip>
</template>
