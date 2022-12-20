<script setup lang="ts">
import type { Account, Paginator } from 'masto/fetch'

const { paginator } = defineProps<{
  paginator: Paginator<any, Account[]>
}>()
</script>

<template>
  <CommonPaginator :paginator="paginator">
    <template #default="{ item }">
      <AccountCard
        :account="item"
        hover-card
        border="b base" py2 px4
      />
    </template>
  </CommonPaginator>
</template>
