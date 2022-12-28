<script lang="ts" setup>
definePageMeta({
  wideLayout: true,
})

const route = useRoute()

const isRootPath = computedEager(() => route.name === 'settings')
</script>

<template>
  <div min-h-screen flex>
    <div border="r base" :class="isRootPath ? 'block lg:flex-none flex-1' : 'hidden lg:block'">
      <MainContent>
        <template #title>
          <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
            <div i-ri:settings-4-line />
            <span>{{ $t('nav.settings') }}</span>
          </div>
        </template>
        <div xl:w-97 lg:w-78 w-full>
          <SettingsNavItem
            command
            icon="i-ri:user-line"
            :text="$t('settings.profile.label')"
            to="/settings/profile"
          />
          <SettingsNavItem
            command
            icon="i-ri-compasses-2-line"
            :text="$t('settings.interface.label')"
            to="/settings/interface"
          />
          <SettingsNavItem
            command
            icon="i-ri-globe-line"
            :text="$t('settings.language.label')"
            to="/settings/language"
          />
          <SettingsNavItem
            command
            icon="i-ri:settings-2-line"
            :text="$t('settings.preferences.label')"
            to="/settings/preferences"
          />
          <SettingsNavItem
            command
            icon="i-ri-group-line"
            :text="$t('settings.users.label')"
            to="/settings/users"
          />
          <SettingsNavItem
            command
            icon="i-ri:information-line"
            :text="$t('settings.about.label')"
            to="/settings/about"
          />
        </div>
      </MainContent>
    </div>
    <div flex-1 :class="isRootPath ? 'hidden lg:block' : 'block'">
      <NuxtPage />
    </div>
  </div>
</template>
