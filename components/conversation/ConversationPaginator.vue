<script setup lang="ts">
import type { Conversation, Paginator } from 'masto'

const { paginator } = defineProps<{
  paginator: Paginator<any, Conversation[]>
}>()
</script>

<template>
  <CommonPaginator
    :paginator="paginator"
  >
    <template #default="{ item }">
      <ConversationCard
        :conversation="item"
        border="b base" py-1
      />
    </template>
  </CommonPaginator>
</template>
