<script setup lang="ts">
import ISO6391 from 'iso-639-1'

const supportedTranslationLanguages = ISO6391.getLanguages([...supportedTranslationCodes])
const userSettings = useUserSettings()

const language = ref<string | null>(null)

const availableOptions = computed(() => {
  return Object.values(supportedTranslationLanguages).filter((value) => {
    return !userSettings.value.disabledTranslationLanguages.includes(value.code)
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
function removeDisabledTranslation(code: string) {
  const uniqueValues = new Set(userSettings.value.disabledTranslationLanguages)
  uniqueValues.delete(code)
  userSettings.value.disabledTranslationLanguages = [...uniqueValues]
}
</script>

<template>
  <div>
    <CommonCheckbox v-model="userSettings.preferences.hideTranslation" :label="$t('settings.preferences.hide_translation')" />
    <div v-if="!userSettings.preferences.hideTranslation" class="mt-1 ms-2">
      <p class=" mb-2">
        {{ $t('settings.language.translations.hide_specific') }}
      </p>
      <div class="ms-4">
        <ul>
          <li v-for="langCode in userSettings.disabledTranslationLanguages" :key="langCode" class="flex items-center">
            <div>{{ ISO6391.getNativeName(langCode) }}</div>
            <button class="btn-text" type="button" :title="$t('settings.language.translations.remove')" @click.prevent="removeDisabledTranslation(langCode)">
              <span class="block i-ri:close-line" aria-hidden="true" />
            </button>
          </li>
        </ul>

        <div class="flex items-center mt-2">
          <select v-model="language" class="select-settings">
            <option disabled selected :value="null">
              {{ $t('settings.language.translations.choose_language') }}
            </option>
            <option v-for="availableOption in availableOptions" :key="availableOption.code" :value="availableOption.code">
              {{ availableOption.nativeName }}
            </option>
          </select>
          <button class="btn-text shrink-0" @click="addDisabledTranslation">
            {{ $t('settings.language.translations.add') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
