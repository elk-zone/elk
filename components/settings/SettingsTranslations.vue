<script lang="ts" setup>
const preferenceHideTranslation = usePreferences('hideTranslation')
const userSettings = useUserSettings()

type AvailableKeys = keyof typeof supportedTranslationLanguages

const language = ref<AvailableKeys | null>(null)

const availableOptions = computed(() => {
  return Object.entries(supportedTranslationLanguages).filter((entry) => {
    const code = entry[0] as AvailableKeys
    return !userSettings.value.disabledTranslationLanguages.includes(code)
  })
})

function addDisabledTranslation() {
  if (language.value) {
    const uniqueValues = new Set(userSettings.value.disabledTranslationLanguages)
    uniqueValues.add(language.value)
    userSettings.value.disabledTranslationLanguages = [...uniqueValues]
    language.value = null
  }
}
function removeDisabledTranslation(code: AvailableKeys) {
  const uniqueValues = new Set(userSettings.value.disabledTranslationLanguages)
  uniqueValues.delete(code)
  userSettings.value.disabledTranslationLanguages = [...uniqueValues]
}
</script>

<template>
  <div>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'hideTranslation')"
      @click="togglePreferences('hideTranslation')"
    >
      {{ $t('settings.preferences.hide_translation') }}
    </SettingsToggleItem>
    <div v-if="!preferenceHideTranslation" class="mt-1">
      <p class="font-medium mb-2">
        Hide specific translations
      </p>
      <ul>
        <li v-for="langCode in userSettings.disabledTranslationLanguages" :key="langCode" class="flex items-center">
          <div>{{ supportedTranslationLanguages[langCode] }}</div>
          <button class="btn-text" type="button" title="remove" @click.prevent="removeDisabledTranslation(langCode)">
            <span class="block i-ri:close-line" aria-hidden="true" />
          </button>
        </li>
      </ul>

      <div class="flex items-center mt-2">
        <select v-model="language" class="select-settings" :disabled="preferenceHideTranslation">
          <option disabled selected>
            Choose language
          </option>
          <option v-for="[code, label] in availableOptions" :key="code" :value="code">
            {{ label }}
          </option>
        </select>
        <button class="btn-text" @click="addDisabledTranslation">
          Add
        </button>
      </div>
    </div>
  </div>
</template>
