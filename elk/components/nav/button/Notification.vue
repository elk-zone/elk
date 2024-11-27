<script setup lang="ts">
import { STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE } from '~/constants'

defineProps<{
  activeClass: string
}>()
const { notifications } = useNotifications()
const lastAccessedNotificationRoute = useLocalStorage(STORAGE_KEY_LAST_ACCESSED_NOTIFICATION_ROUTE, '')
</script>

<template>
  <NuxtLink :to="`/notifications/${lastAccessedNotificationRoute}`" :aria-label="$t('nav.notifications')" :active-class="activeClass" flex flex-row items-center place-content-center h-full flex-1 class="coarse-pointer:select-none" @click="$scrollToTop">
    <div flex relative>
      <div class="i-ri:notification-4-line" text-xl />
      <div v-if="notifications" class="top-[-0.3rem] right-[-0.3rem]" absolute font-bold rounded-full h-4 w-4 text-xs bg-primary text-inverted flex items-center justify-center>
        {{ notifications < 10 ? notifications : '•' }}
      </div>
    </div>
  </NuxtLink>
</template>
