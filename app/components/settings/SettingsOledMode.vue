<script setup lang="ts">
const colorMode = useColorMode()
const userSettings = useUserSettings()

const isDark = computed(() => colorMode.value === 'dark')
</script>

<template>
  <section v-if="isDark" space-y-2>
    <SettingsToggleItem
      :checked="getPreferences(userSettings, 'oledMode')"
      @click="togglePreferences('oledMode')"
    >
      {{ $t('settings.interface.oled_mode') }}
    </SettingsToggleItem>
  </section>
</template>
