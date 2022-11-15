<script setup lang="ts">
import type { Notification, Paginator } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Notification[]>
}>()

const { items: notifications, isLoading, isDone, endAnchor } = usePaginator(paginator)
</script>

<template>
  <template v-for="notification of notifications" :key="notification.id">
    <NotificationCard :notification="notification" border="t border" pt-4 />
  </template>
  <div ref="endAnchor" />
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-if="isDone">
    End of list
  </div>
</template>
