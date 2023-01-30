<script setup lang="ts">
import Fuse from 'fuse.js'

let { modelValue } = $defineModel<{
  modelValue: string
}>()

const { t } = useI18n()

const languageKeyword = $ref('')

const fuse = new Fuse(languagesNameList, {
  keys: ['code', 'nativeName', 'name'],
  shouldSort: true,
})

const languages = $computed(() =>
  languageKeyword.trim()
    ? fuse.search(languageKeyword).map(r => r.item)
    : [...languagesNameList].sort(({ code: a }, { code: b }) => {
        return a === modelValue ? -1 : b === modelValue ? 1 : a.localeCompare(b)
      }),
)

function chooseLanguage(language: string) {
  modelValue = language
}
</script>

<template>
  <div relative of-x-hidden>
    <div p2>
      <input
        v-model="languageKeyword"
        :placeholder="t('language.search')"
        p2 border-rounded w-full bg-transparent
        outline-none border="~ base"
      >
    </div>
    <div max-h-40vh overflow-auto>
      <CommonDropdownItem
        v-for="{ code, nativeName, name } in languages"
        :key="code"
        :text="nativeName"
        :description="name"
        :checked="code === modelValue"
        @click="chooseLanguage(code)"
      />
    </div>
  </div>
</template>
