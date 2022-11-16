<script setup lang="ts">
import type { Account, Paginator } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Account[]>
}>()

const { items: accounts, state, endAnchor } = usePaginator(paginator)
</script>

<template>
  <CommonPaginator :state="state">
    <template v-for="account of accounts" :key="account.id">
      <AccountCard :account="account" border="t border" pt-4 />
    </template>
    <div ref="endAnchor" />
  </CommonPaginator>
</template>
