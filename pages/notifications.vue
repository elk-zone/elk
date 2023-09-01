<script setup lang="ts">
import { NOTIFICATION_TYPES } from '~/constants'
import type { CommonRouteTabMoreOption, CommonRouteTabOption } from '~/components/common/CommonRouteTabs.vue'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const pwaEnabled = useAppConfig().pwaEnabled

const tabs = $computed<CommonRouteTabOption[]>(() => [
  {
    name: 'all',
    to: '/notifications',
    display: isHydrated.value ? t('tab.notifications_all') : '',
  },
  {
    name: 'mention',
    to: '/notifications/mention',
    display: isHydrated.value ? t('tab.notifications_mention') : '',
  },
])

const supportedTypes = NOTIFICATION_TYPES.filter(type => type !== 'mention' && !type.includes('admin'))
const more = $computed<CommonRouteTabOption[]>(() => supportedTypes.map(
  name => ({
    name,
    to: `/notifications/${name}`,
    display: t(`tab.notifications_${name}`),
  }),
))
const moreOptions: CommonRouteTabMoreOption = {
  options: more,
  icon: 'i-ri:filter-2-line',
  tooltip: t('tab.notifications_more_tooltip'),
}
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/notifications" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:notification-4-line />
        <span>{{ t('nav.notifications') }}</span>
      </NuxtLink>
    </template>

    <template #actions>
      <NuxtLink
        flex rounded-4 p1
        hover:bg-active cursor-pointer transition-100
        :title="t('settings.notifications.show_btn')"
        to="/settings/notifications"
      >
        <span aria-hidden="true" i-ri:notification-badge-line />
      </NuxtLink>
    </template>

    <template #header>
      <CommonRouteTabs replace :options="tabs" :more-options="moreOptions" />
    </template>

    <slot>
      <template v-if="pwaEnabled">
        <NotificationPreferences />
      </template>

      <NuxtPage />
    </slot>
  </MainContent>
</template>
