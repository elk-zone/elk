<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()
const showSettings = ref(false)
const disableSettings = ref(true)

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

    <template #actions>
      <button
        flex rounded-4 p2
        :title="$t('notification.settings.title')"
        :disabled="disableSettings"
        :class="disableSettings ? null : 'hover:bg-active cursor-pointer transition-100'"
        @click="showSettings = !showSettings"
      >
        <span aria-hidden="true" i-ri:settings-3-fill :class="disableSettings ? 'op-30' : null" />
      </button>
    </template>

    <template #header>
      <CommonTabs v-model="tab" :options="tabs" />
      <NotificationPreferences :show="showSettings" @warning="disableSettings = $event" />
    </template>
    <slot>
      <NotificationPaginator :key="tab" v-bind="{ paginator, stream }" />
    </slot>
  </MainContent>
</template>
