<script setup lang="ts">
import type { Paginator, mastodon } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<mastodon.v1.Account[], any>
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
