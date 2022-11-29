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
      <NuxtLink to="/notifications" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:notification-4-line />
        <span>{{ t('nav_side.notifications') }}</span>
      </NuxtLink>
    </template>

    <template #header>
      <CommonTabs v-model="tab" :options="tabNames" />
    </template>
    <slot>
      <NotificationPaginator :key="tab" :paginator="paginator" />
    </slot>
  </MainContent>
</template>
