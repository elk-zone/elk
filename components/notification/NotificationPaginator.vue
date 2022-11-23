<script setup lang="ts">
import type { Notification, Paginator } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Notification[]>
}>()
</script>

<template>
  <CommonPaginator
    :paginator="paginator"
    border="t base"
  >
    <template #default="{ item }">
      <NotificationCard
        :notification="item"
        border="t base" pt-4
      />
    </template>
  </CommonPaginator>
</template>
