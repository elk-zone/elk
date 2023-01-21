<script setup lang="ts">
import type { mastodon } from 'masto'

const { status } = defineProps<{
  status: mastodon.v1.Status
}>()

const {
  toggle: _toggleTranslation,
  translation,
  enabled: isTranslationEnabled,
} = useTranslation(status, getLanguageCode())
const preferenceHideTranslation = usePreferences('hideTranslation')

const showButton = computed(() => !preferenceHideTranslation.value && isTranslationEnabled)

let translating = $ref(false)
const toggleTranslation = async () => {
  translating = true
  try {
    await _toggleTranslation()
  }
  finally {
    translating = false
  }
}
</script>

<template>
  <div>
    <button
      v-if="showButton" p-0 flex="~ center" gap-2 text-sm
      :disabled="translating" disabled-bg-transparent btn-text class="disabled-text-$c-text-btn-disabled-deeper" @click="toggleTranslation"
    >
      <span v-if="translating" block animate-spin preserve-3d>
        <span block i-ri:loader-2-fill />
      </span>
      <div v-else i-ri:translate />
      {{ translation.visible ? $t('menu.show_untranslated') : $t('menu.translate_post') }}
    </button>
  </div>
</template>

<style scoped></style>
