<script setup lang="ts">
import type { mastodon } from 'masto'
import { NOTIFICATION_TYPES } from '~/constants'
import type {
  CommonRouteTabMoreOption,
  CommonRouteTabOption,
} from '~/components/common/CommonRouteTabs.vue'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
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

const filter = $computed(() => {
  if (!isHydrated.value)
    return undefined

  const rawFilter = route.params?.filter
  if (!rawFilter)
    return undefined

  if (NOTIFICATION_TYPES.includes(Array.isArray(rawFilter) ? rawFilter[0] : rawFilter))
    return rawFilter as mastodon.v1.NotificationType

  return undefined
})

const icons = NOTIFICATION_TYPES.reduce((acc, name) => {
  switch (name) {
    case 'status':
      acc[name] = 'i-ri:account-pin-circle-line'
      break
    case 'reblog':
      acc[name] = 'i-ri:repeat-fill'
      break
    case 'follow':
      acc[name] = 'i-ri:user-follow-line'
      break
    case 'follow_request':
      acc[name] = 'i-ri:user-shared-line'
      break
    case 'favourite':
      acc[name] = 'i-ri:heart-3-line'
      break
    case 'poll':
      acc[name] = 'i-ri:chat-poll-line'
      break
    case 'update':
      acc[name] = 'i-ri:edit-2-line'
      break
    case 'admin.report':
      acc[name] = 'i-ri:flag-line'
      break
    case 'admin.sign_up':
      acc[name] = 'i-ri:user-add-line'
      break
  }
  return acc
}, {} as Record<string, string>)

const filterText = $computed(() => (`${t('tab.notifications_more_tooltip')}${filter ? `: ${t(`tab.notifications_${filter}`)}` : ''}`))

const more = $computed<CommonRouteTabOption[]>(() => NOTIFICATION_TYPES.filter(type => type !== 'mention').map(
  name => ({
    name,
    to: `/notifications/${name}`,
    display: isHydrated.value ? t(`tab.notifications_${name}`) : '',
    icon: icons[name],
    match: name === filter,
  }),
))
const moreOptions = $computed<CommonRouteTabMoreOption>(() => ({
  options: more,
  icon: 'i-ri:filter-2-line',
  tooltip: filterText,
  match: !!filter,
}))
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/notifications" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:notification-4-line />
        <span>{{ isHydrated ? t('nav.notifications') : '' }}</span>
      </NuxtLink>
    </template>

    <template #actions>
      <NuxtLink
        flex rounded-4 p1
        hover:bg-active cursor-pointer transition-100
        :title="isHydrated ? t('settings.notifications.show_btn') : ''"
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
