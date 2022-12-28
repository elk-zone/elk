<script setup lang="ts">
import type { Status, StatusEdit } from 'masto'
import { formatTimeAgo } from '@vueuse/core'

const { status } = defineProps<{
  status: Status
}>()

const masto = useMasto()
const { data: statusEdits } = useAsyncData(`status:history:${status.id}`, () => masto.statuses.fetchHistory(status.id).then(res => res.reverse()))

const showHistory = (edit: StatusEdit) => {
  openEditHistoryDialog(edit)
}
const timeAgoOptions = useTimeAgoOptions()
</script>

<template>
  <template v-if="statusEdits">
    <CommonDropdownItem
      v-for="(edit, idx) in statusEdits"
      :key="idx"
      px="0.5"
      @click="showHistory(edit)"
    >
      {{ getDisplayName(edit.account) }}

      <template v-if="idx === statusEdits.length - 1">
        <i18n-t keypath="status_history.created">
          {{ formatTimeAgo(new Date(edit.createdAt), timeAgoOptions) }}
        </i18n-t>
      </template>
      <template v-else>
        <i18n-t keypath="status_history.edited">
          {{ formatTimeAgo(new Date(edit.createdAt), timeAgoOptions) }}
        </i18n-t>
      </template>
    </CommonDropdownItem>
  </template>
  <template v-else>
    <div i-ri:loader-2-fill animate-spin text-2xl ma />
  </template>
</template>
