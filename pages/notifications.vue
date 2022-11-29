<script setup lang="ts">
import { STORAGE_KEY_NOTIFY_TAB } from '~/constants'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

const paginatorAll = useMasto().notifications.getIterator()
const paginatorMention = useMasto().notifications.getIterator({ types: ['mention'] })

const tabs = $computed(() => [
  {
    name: 'all',
    display: t('tab.notifications_all'),
    paginator: paginatorAll,
  },
  {
    name: 'mention',
    display: t('tab.notifications_mention'),
    paginator: paginatorMention,
  },
] as const)

// Don't use local storage because it is better to default to Posts every time you visit a user's profile.
const tab = $ref(tabs[0].name)
const paginator = $computed(() => tabs.find(t => t.name === tab)!.paginator)

useHeadFixed({
  title: () => t('nav_side.notifications'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/notifications" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:notification-4-line />
        <span>{{ t('nav_side.notifications') }}</span>
      </NuxtLink>
    </template>

    <template #header>
      <CommonTabs v-model="tab" :options="tabs" />
    </template>
    <slot>
      <NotificationPaginator :key="tab" :paginator="paginator" />
    </slot>
  </MainContent>
</template>
