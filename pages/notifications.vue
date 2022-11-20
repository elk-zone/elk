<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const masto = await useMasto()

const tabNames = ['All', 'Mentions'] as const
const tab = $(useLocalStorage<typeof tabNames[number]>('nuxtodon-notifications-tab', 'All'))

const paginator = $computed(() => {
  return masto.notifications.getIterator(tab === 'All' ? undefined : { types: ['mention'] })
})
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:notification-2-fill h-6 mr-1 /><span>Notifications</span>
    </template>
    <template #actions>
      <div color-gray i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <CommonTabs v-model="tab" :options="tabNames" />
      <NotificationPaginator :key="tab" :paginator="paginator" />
    </slot>
  </MainContent>
</template>
