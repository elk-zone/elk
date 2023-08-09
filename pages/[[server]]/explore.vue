<script setup lang="ts">
import type { CommonRouteTabOption } from '~/components/common/CommonRouteTabs.vue'

const { t } = useI18n()

const search = $ref<{ input?: HTMLInputElement }>()
const route = useRoute()
watchEffect(() => {
  if (isMediumOrLargeScreen && route.name === 'explore' && search?.input)
    search?.input?.focus()
})
onActivated(() =>
  search?.input?.focus(),
)
onDeactivated(() => search?.input?.blur())

const userSettings = useUserSettings()

const tabs = $computed<CommonRouteTabOption[]>(() => [
  {
    to: isHydrated.value ? `/${currentServer.value}/explore` : '/explore',
    display: isHydrated.value ? t('tab.posts') : '',
  },
  {
    to: isHydrated.value ? `/${currentServer.value}/explore/tags` : '/explore/tags',
    display: isHydrated.value ? t('tab.hashtags') : '',
  },
  {
    to: isHydrated.value ? `/${currentServer.value}/explore/links` : '/explore/links',
    display: isHydrated.value ? t('tab.news') : '',
    hide: userSettings.value.preferences.hideNews,
  },
  // This section can only be accessed after logging in
  {
    to: isHydrated.value ? `/${currentServer.value}/explore/users` : '/explore/users',
    display: isHydrated.value ? t('tab.for_you') : '',
    disabled: !isHydrated.value || !currentUser.value,
  },
])
</script>

<template>
  <MainContent>
    <template #title>
      <span timeline-title-style flex items-center gap-2 cursor-pointer @click="$scrollToTop">
        <div i-ri:hashtag />
        <span>{{ t('nav.explore') }}</span>
      </span>
    </template>

    <template #header>
      <CommonRouteTabs replace :options="tabs" />
    </template>
    <NuxtPage v-if="isHydrated" />
  </MainContent>
</template>
