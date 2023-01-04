<script setup lang="ts">
import ISO6391 from 'iso-639-1'
import Fuse from 'fuse.js'

let { modelValue } = $defineModel<{
  modelValue: string | null | undefined
}>()

const { t } = useI18n()

const languageKeyword = $ref('')

const languageList: {
  code: string | null
  nativeName: string
  name?: string
}[] = [{
  code: null,
  nativeName: t('language.none'),
}, ...ISO6391.getAllCodes().map(code => ({
  code,
  nativeName: ISO6391.getNativeName(code),
  name: ISO6391.getName(code),
}))]

const fuse = new Fuse(languageList, {
  keys: ['code', 'nativeName', 'name'],
  shouldSort: true,
})

const languages = $computed(() =>
  languageKeyword.trim()
    ? fuse.search(languageKeyword).map(r => r.item)
    : [...languageList].sort(({ code: a }, { code: b }) => {
        return a === modelValue
          ? -1
          : b === modelValue
            ? 1
            : (a === null ? -1 : b === null ? 1 : a.localeCompare(b))
      }),
)

function chooseLanguage(language: string | null) {
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
        :checked="code === (modelValue || null)"
        @click="chooseLanguage(code)"
      >
        {{ nativeName }}
        <template #description>
          <template v-if="name">
            {{ name }}
          </template>
        </template>
      </CommonDropdownItem>
    </div>
  </div>
</template>
