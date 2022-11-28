<script setup lang="ts">
import { STORAGE_KEY_NOTIFY_TAB } from '~/constants'

definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

const tabNames = ['All', 'Mentions'] as const
const tab = $(useLocalStorage<typeof tabNames[number]>(STORAGE_KEY_NOTIFY_TAB, 'All'))

const paginator = $computed(() => {
  return useMasto().notifications.getIterator(tab === 'All' ? undefined : { types: ['mention'] })
})

useHead({
  title: () => t('nav_side.notifications'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>{{ t('nav_side.notifications') }}</span>
    </template>

    <template #header>
      <CommonTabs v-model="tab" :options="tabNames" />
    </template>
    <slot>
      <NotificationPaginator :key="tab" :paginator="paginator" />
    </slot>
  </MainContent>
</template>
