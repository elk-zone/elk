<script setup lang="ts">
import type { Paginator, Status } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Status[]>
}>()
</script>

<template>
  <CommonPaginator
    :paginator="paginator"
    border="t border"
  >
    <template #default="{ item }">
      <StatusCard
        :status="item"
        border="b border" py-3
      />
    </template>
  </CommonPaginator>
</template>
