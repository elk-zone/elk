<script setup lang="ts">
import type { mastodon } from 'masto'
import { formatTimeAgo } from '@vueuse/core'

const { status } = defineProps<{
  status: mastodon.v1.Status
}>()

const paginator = useMastoClient().v1.statuses.$select(status.id).history.list()

function showHistory(edit: mastodon.v1.StatusEdit) {
  openEditHistoryDialog(edit)
}
const timeAgoOptions = useTimeAgoOptions()

// TODO: rework, this is only reversing the first page of edits
function reverseHistory(items: mastodon.v1.StatusEdit[]) {
  return [...items].reverse()
}
</script>

<template>
  <CommonPaginator :paginator="paginator" key-prop="createdAt" :preprocess="reverseHistory">
    <template #default="{ items, item, index }">
      <CommonDropdownItem
        px="0.5"
        @click="showHistory(item)"
      >
        {{ getDisplayName(item.account) }}

        <template v-if="index === items.length - 1">
          <i18n-t keypath="status_history.created">
            {{ formatTimeAgo(new Date(item.createdAt), timeAgoOptions) }}
          </i18n-t>
        </template>
        <i18n-t v-else keypath="status_history.edited">
          {{ formatTimeAgo(new Date(item.createdAt), timeAgoOptions) }}
        </i18n-t>
      </CommonDropdownItem>
    </template>
    <template #loading>
      <StatusEditHistorySkeleton />
      <StatusEditHistorySkeleton op50 />
      <StatusEditHistorySkeleton op25 />
    </template>
    <template #done>
      <span />
    </template>
  </CommonPaginator>
</template>
