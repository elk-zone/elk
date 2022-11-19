<script setup lang="ts">
import type { FetchNotificationsParams } from 'masto'
definePageMeta({
  middleware: 'auth',
})

const masto = await useMasto()

const tabNames = ['all', 'mentions'] as const
const tab = $(useLocalStorage<typeof tabNames[number]>('nuxtodon-notifications-tab', 'all'))

const paginator = $computed(() => {
  return masto.notifications.getIterator(tab === 'all' ? undefined : { types: ['mention'] })
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
      <div flex w-full>
        <template v-for="type in tabNames" :key="type">
          <input
            :id="`tab-${type}`" v-model="tab" :value="type" type="radio" name="tabs" display="none"
          ><label flex w-full justify-center h-8 cursor-pointer :for="`tab-${type}`" :class="tab === type ? 'color-primary' : 'hover:color-purple'" tabindex="1" @keypress.enter="tab = type">{{ type }}</label>
        </template>
      </div>
      <NotificationPaginator :key="tab" :paginator="paginator" />
    </slot>
  </MainContent>
</template>
