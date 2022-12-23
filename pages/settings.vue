<script lang="ts" setup>
definePageMeta({
  wideLayout: true,
})
</script>

<template>
  <div min-h-screen flex>
    <div border="none md:l md:r base">
      <MainContent>
        <template #title>
          <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
            <div i-ri:settings-4-line />
            <span>{{ $t('nav_side.settings') }}</span>
          </div>
        </template>
        <div w-97>
          <SettingsNavItem
            command
            icon="i-ri:user-line"
            :text="$t('settings.profile.label')"
            to="/settings/profile"
          />
          <SettingsNavItem
            command
            icon="i-ri:settings-2-line"
            :text="$t('settings.preferences.label')"
            to="/settings/preferences"
          />
        </div>
      </MainContent>
    </div>
    <div flex-1>
      <NuxtPage />
    </div>
  </div>
</template>
