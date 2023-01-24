<script setup lang="ts">
const { t } = useI18n()

const nativeSettings = useNativeSettings()!

let dontMinimiseToTray = $ref(false)
let mounted = false
async function update() {
  if (!mounted)
    return
  await nativeSettings.set('dont_minimize_to_tray', dontMinimiseToTray)
  await nativeSettings.save()
  dontMinimiseToTray = !dontMinimiseToTray
}

onMounted(async () => {
  dontMinimiseToTray = !!await nativeSettings.get('dont_minimize_to_tray')

  mounted = true
})

useHeadFixed({
  title: () => `${t('settings.native.label')} | ${t('nav.settings')}`,
})

definePageMeta({
  validate() {
    return !!import.meta.env.TAURI_PLATFORM
  },
})
</script>

<template>
  <MainContent back-on-small-screen>
    <template #title>
      <h1 text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        {{ $t('settings.native.label') }}
      </h1>
    </template>
    <SettingsToggleItem
      :checked="dontMinimiseToTray"
      @click="update"
    >
      <!-- TODO: Toggle native settings -->
      {{ $t('settings.native.minimize_to_tray') }}
    </SettingsToggleItem>
  </MainContent>
</template>
