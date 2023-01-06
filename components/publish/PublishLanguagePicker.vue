<script setup lang="ts">
import ISO6391 from 'iso-639-1'
import Fuse from 'fuse.js'

let { modelValue } = $defineModel<{
  modelValue: string
}>()

const { t } = useI18n()

const languageKeyword = $ref('')

const languageList: {
  code: string
  nativeName: string
  name: string
}[] = ISO6391.getAllCodes().map(code => ({
  code,
  nativeName: ISO6391.getNativeName(code),
  name: ISO6391.getName(code),
}))

const fuse = new Fuse(languageList, {
  keys: ['code', 'nativeName', 'name'],
  shouldSort: true,
})

const languages = $computed(() =>
  languageKeyword.trim()
    ? fuse.search(languageKeyword).map(r => r.item)
    : [...languageList].sort(({ code: a }, { code: b }) => {
        return a === modelValue ? -1 : b === modelValue ? 1 : a.localeCompare(b)
      }),
)

function chooseLanguage(language: string) {
  modelValue = language
}
</script>

<template>
  <div>
    <input
      v-model="languageKeyword"
      :placeholder="t('language.search')"
      p2 mb2 border-rounded w-full bg-transparent
      outline-none border="~ base"
    >
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
