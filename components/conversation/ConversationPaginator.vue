<script setup lang="ts">
import type { Paginator, mastodon } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<mastodon.v1.Conversation[], any>
}>()
</script>

<template>
  <CommonPaginator :paginator="paginator">
    <template #default="{ item }">
      <ConversationCard
        :conversation="item"
        border="b base" py-1
      />
    </template>
  </CommonPaginator>
</template>
