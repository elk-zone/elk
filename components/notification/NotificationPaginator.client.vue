<script setup lang="ts">
import type { Notification, Paginator } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Notification[]>
}>()
</script>

<template>
  <CommonPaginator
    :paginator="paginator"
    border="t border"
  >
    <template #default="{ item }">
      <NotificationCard
        :notification="item"
        border="t border" pt-4
      />
    </template>
  </CommonPaginator>
</template>
