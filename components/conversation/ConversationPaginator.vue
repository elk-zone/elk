<script setup lang="ts">
import type { mastodon } from 'masto'

const { paginator } = defineProps<{
  paginator: mastodon.Paginator<mastodon.v1.Conversation[], mastodon.DefaultPaginationParams>
}>()

function preprocess(items: mastodon.v1.Conversation[]): mastodon.v1.Conversation[] {
  const isAuthored = (conversation: mastodon.v1.Conversation) => conversation.lastStatus ? conversation.lastStatus.account.id === currentUser.value?.account.id : false
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
