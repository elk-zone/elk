<script setup lang="ts">
import type { mastodon } from 'masto'

defineProps<{
  paginator: mastodon.Paginator<mastodon.v1.Conversation[], mastodon.DefaultPaginationParams>
}>()

function preprocess(items: mastodon.v1.Conversation[]): mastodon.v1.Conversation[] {
  const isAuthored = (conversation: mastodon.v1.Conversation) => conversation.lastStatus ? conversation.lastStatus.account.id === currentUser.value?.account.id : false
  return items
    .map((item) => {
      if (!item.lastStatus || (item.lastStatus.filtered && item.lastStatus.filtered.length > 0))
        return item
      return { ...item, lastStatus: applyClientFiltersToStatus(item.lastStatus, 'thread') }
    })
    .filter(item => isAuthored(item) || !item.lastStatus?.filtered?.find(
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
