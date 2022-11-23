<script setup lang="ts">
import type { Account, Paginator } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Account[]>
}>()
</script>

<template>
  <CommonPaginator
    :paginator="paginator"
    border="t base"
  >
    <template #default="{ item }">
      <AccountCard
        :account="item"
        border="b base" py-1
      />
    </template>
  </CommonPaginator>
</template>
