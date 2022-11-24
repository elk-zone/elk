<script setup lang="ts">
import type { Paginator, Status } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Status[]>
}>()
</script>

<template>
  <CommonPaginator :paginator="paginator">
    <template #default="{ item }">
      <StatusCard
        :status="item"
        border="b base" py-3
      />
    </template>
  </CommonPaginator>
</template>
