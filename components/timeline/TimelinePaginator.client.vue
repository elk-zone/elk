<script setup lang="ts">
import type { Paginator, Status } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Status[]>
}>()

const { items: statuses, state, endAnchor } = usePaginator(paginator)
</script>

<template>
  <CommonPaginator :state="state">
    <template v-for="status of statuses" :key="status.id">
      <StatusCard :status="status" border="t border" pt-4 />
    </template>
    <div ref="endAnchor" />
  </CommonPaginator>
</template>
