<script setup lang="ts">
definePageMeta({
  wideLayout: true,
})

const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.settings'),
})

const route = useRoute()

const isRootPath = computed(() => route.name === 'settings')
</script>

<template>
  <div>
    <div min-h-screen flex>
      <div border="e base" :class="isRootPath ? 'block lg:flex-none flex-1' : 'hidden lg:block'">
        <MainContent>
          <template #title>
            <div timeline-title-style flex items-center gap-2 @click="$scrollToTop">
              <div i-ri:settings-3-line />
              <span>{{ $t('nav.settings') }}</span>
            </div>
          </template>
          <div xl:w-97 lg:w-78 w-full>
            <SettingsItem
              v-if="currentUser"
              command
              icon="i-ri:user-line"
              :text="$t('settings.profile.label')"
              to="/settings/profile"
              :match="$route.path.startsWith('/settings/profile/')"
            />
            <SettingsItem
              command
              icon="i-ri-compasses-2-line"
              :text="$t('settings.interface.label')"
              to="/settings/interface"
              :match="$route.path.startsWith('/settings/interface/')"
            />
            <SettingsItem
              v-if="currentUser"
              command
              icon="i-ri:notification-badge-line"
              :text="$t('settings.notifications_settings')"
              to="/settings/notifications"
              :match="$route.path.startsWith('/settings/notifications/')"
            />
            <SettingsItem
              command
              icon="i-ri-globe-line"
              :text="$t('settings.language.label')"
              to="/settings/language"
              :match="$route.path.startsWith('/settings/language/')"
            />
            <SettingsItem
              command
              icon="i-ri-equalizer-line"
              :text="$t('settings.preferences.label')"
              to="/settings/preferences"
              :match="$route.path.startsWith('/settings/preferences/')"
            />
            <SettingsItem
              command
              icon="i-ri-group-line"
              :text="$t('settings.users.label')"
              to="/settings/users"
              :match="$route.path.startsWith('/settings/users/')"
            />
            <SettingsItem
              command
              icon="i-ri:information-line"
              :text="$t('settings.about.label')"
              to="/settings/about"
              :match="$route.path.startsWith('/settings/about/')"
            />
          </div>
        </MainContent>
      </div>
      <div flex-1 :class="isRootPath ? 'hidden lg:block' : 'block'">
        <ClientOnly>
          <NuxtPage />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>
