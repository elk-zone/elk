<script lang="ts" setup>
definePageMeta({
  layout: 'settings',
})
</script>

<template>
  <div min-h-screen flex>
    <div border="none md:l md:r base">
      <MainContent>
        <template #title>
          <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
            <div i-ri:settings-4-line />
            <span>Settings</span>
          </div>
        </template>
        <div w-97>
          <SettingsNavItem command icon="i-ri:user-settings-line" to="/settings/profile">
            Profile
          </SettingsNavItem>
          <SettingsNavItem command icon="i-ri:hashtag" to="/settings/featured_tags">
            Featured tags
          </SettingsNavItem>
        </div>
      </MainContent>
    </div>
    <div flex-1>
      <NuxtPage />
    </div>
  </div>
</template>
