<script setup lang="ts">
import type { Paginator, Status } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Status[]>
}>()

const { items: statuses, isLoading, isDone, endAnchor } = usePaginator(paginator)
</script>

<template>
  <template v-for="status of statuses" :key="status.id">
    <StatusCard :status="status" border="t border" pt-4 />
  </template>
  <div ref="endAnchor" />
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-if="isDone">
    End of list
  </div>
</template>
