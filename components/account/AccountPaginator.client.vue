<script setup lang="ts">
import type { Account, Paginator } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Account[]>
}>()
</script>

<template>
  <CommonPaginator
    :paginator="paginator"
    border="t border"
  >
    <template #default="{ item }">
      <AccountCard
        :account="item"
        border="b border" py-1
      />
    </template>
  </CommonPaginator>
</template>
