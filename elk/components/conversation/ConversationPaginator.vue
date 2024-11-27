<script setup lang="ts">
import type { akkoma } from 'akko'

const { paginator } = defineProps<{
  paginator: akkoma.Paginator<akkoma.v1.Conversation[], akkoma.DefaultPaginationParams>
}>()

function preprocess(items: akkoma.v1.Conversation[]): akkoma.v1.Conversation[] {
  const isAuthored = (conversation: akkoma.v1.Conversation) => conversation.lastStatus ? conversation.lastStatus.account.id === currentUser.value?.account.id : false
  return items.filter(item => isAuthored(item) || !item.lastStatus?.filtered?.find(
    filter => filter.filter.filterAction === 'hide' && filter.filter.context.includes('thread'),
  ))
}
</script>

<template>
  <CommonPaginator :paginator="paginator" :preprocess="preprocess">
    <template #default="{ item }">
      <ConversationCard
        :conversation="item"
        border="b base" py-1
      />
    </template>
  </CommonPaginator>
</template>
