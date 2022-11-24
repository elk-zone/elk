<script setup lang="ts">
import type { Notification, Paginator } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Notification[]>
}>()
</script>

<template>
  <CommonPaginator :paginator="paginator">
    <template #default="{ item }">
      <NotificationCard
        :notification="item"
        hover:bg-active
        border="b base" pt-4
      />
    </template>
  </CommonPaginator>
</template>
