<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const tabNames = ['All', 'Mentions'] as const
const tab = $(useLocalStorage<typeof tabNames[number]>('nuxtodon-notifications-tab', 'All'))

const paginator = $computed(() => {
  return masto.notifications.getIterator(tab === 'All' ? undefined : { types: ['mention'] })
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Notifications</span>
    </template>
    <template #actions>
      <div i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <template #header>
      <CommonTabs v-model="tab" :options="tabNames" />
    </template>
    <slot>
      <NotificationPaginator :key="tab" :paginator="paginator" />
    </slot>
  </MainContent>
</template>
