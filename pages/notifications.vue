<script setup lang="ts">
import { STORAGE_KEY_NOTIFY_TAB } from '~/constants'

definePageMeta({
  middleware: 'auth',
})

const tabNames = ['All', 'Mentions'] as const
const tab = $(useLocalStorage<typeof tabNames[number]>(STORAGE_KEY_NOTIFY_TAB, 'All'))

const paginator = $computed(() => {
  return masto.notifications.getIterator(tab === 'All' ? undefined : { types: ['mention'] })
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Notifications</span>
    </template>

    <template #header>
      <CommonTabs v-model="tab" :options="tabNames" />
    </template>
    <slot>
      <NotificationPaginator :key="tab" :paginator="paginator" />
    </slot>
  </MainContent>
</template>
