<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { STORAGE_KEY_LANG } from '~/constants'

const { locale } = useI18n()
useLocalStorage(STORAGE_KEY_LANG, locale)

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
  <CommonTooltip placement="bottom" content="Select Language">
    <CommonDropdown>
      <button align-top>
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
