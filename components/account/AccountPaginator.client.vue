<script setup lang="ts">
import type { Account, Paginator } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Account[]>
}>()

const { items: accounts, isLoading, isDone, endAnchor } = usePaginator(paginator)
</script>

<template>
  <template v-for="account of accounts" :key="account.id">
    <AccountCard :account="account" border="t border" pt-4 />
  </template>
  <div ref="endAnchor" />
  <div v-if="isLoading">
    Loading...
  </div>
  <div v-if="isDone">
    End of list
  </div>
</template>
