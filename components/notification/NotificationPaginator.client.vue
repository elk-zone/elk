<script setup lang="ts">
import type { Notification, Paginator } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Notification[]>
}>()

const { items: notifications, state, endAnchor } = usePaginator(paginator)
</script>

<template>
  <CommonPaginator :state="state">
    <template v-for="notification of notifications" :key="notification.id">
      <NotificationCard :notification="notification" border="t border" pt-4 />
    </template>
    <div ref="endAnchor" />
  </CommonPaginator>
</template>
