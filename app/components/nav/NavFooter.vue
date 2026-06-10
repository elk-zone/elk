<script setup lang="ts">
import type { ThemeColors } from '~/composables/settings'
import themesJson from '~/constants/themes.json'

const config = useRuntimeConfig()
const userSettings = useUserSettings()

const colorMode = useColorMode()

const omediaTheme = (themesJson as unknown as [string, ThemeColors][])
  .find(([key]) => key === '#f5322d')?.[1]

function toggleDark() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  if (omediaTheme)
    userSettings.value.themeColors = omediaTheme
}
</script>

<template>
  <footer p4 text-sm text-secondary-light flex="~ col">
    <div flex="~ gap2" items-center mb4>
      <CommonTooltip :content="$t('nav.toggle_theme')">
        <button flex dark-i-ri:sun-line i-ri:moon-line text-lg :aria-label="$t('nav.toggle_theme')" @click="toggleDark()" />
      </CommonTooltip>
      <CommonTooltip :content="$t('nav.zen_mode')">
        <button
          flex
          text-lg
          :class="getPreferences(userSettings, 'zenMode') ? 'i-ri:layout-right-2-line' : 'i-ri:layout-right-line'"
          :aria-label="$t('nav.zen_mode')"
          @click="togglePreferences('zenMode')"
        />
      </CommonTooltip>
    </div>
    <div v-if="config.public.privacyPolicyUrl">
      <NuxtLink cursor-pointer hover:underline :to="config.public.privacyPolicyUrl">
        {{ $t('nav.privacy') }}
      </NuxtLink>
    </div>
  </footer>
</template>
