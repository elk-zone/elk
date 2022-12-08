<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const showSettings = ref(false)
const pwaEnabled = useRuntimeConfig().public.pwaEnabled

const paginatorAll = useMasto().notifications.iterate()
const paginatorMention = useMasto().notifications.iterate({ types: ['mention'] })

const { clearNotifications } = useNotifications()
onActivated(clearNotifications)

const stream = await useMasto().stream.streamUser()

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
        <span>{{ $t('nav_side.notifications') }}</span>
      </NuxtLink>
    </template>

    <template v-if="pwaEnabled" #actions>
      <button
        flex rounded-4 p2
        hover:bg-active cursor-pointer transition-100
        :title="$t('notification.settings.title')"
        @click="showSettings = !showSettings"
      >
        <span aria-hidden="true" i-ri:settings-3-fill />
      </button>
    </template>

    <template #header>
      <CommonTabs v-model="tab" :options="tabs" />
      <!-- can go also here -->
      <!--
            <NotificationPreferences :show="showSettings" />
-->
    </template>
    <slot>
      <NotificationPreferences :show="showSettings" />
      <NotificationPaginator :key="tab" v-bind="{ paginator, stream }" />
    </slot>
  </MainContent>
</template>
