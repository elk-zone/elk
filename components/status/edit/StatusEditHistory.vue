<script setup lang="ts">
import type { Status, StatusEdit } from 'masto'

const { status } = defineProps<{
  status: Status
}>()

const { data: statusEdits } = useAsyncData(`status:history:${status.id}`, () => useMasto().statuses.fetchHistory(status.id).then(res => res.reverse()))

const showHistory = (edit: StatusEdit) => {
  openEditHistoryDialog(edit)
}
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
      {{ idx === statusEdits.length - 1 ? 'created' : 'edited' }}
      {{ useTimeAgo(edit.createdAt, { showSecond: true }).value }}
    </CommonDropdownItem>
  </template>
  <template v-else>
    <div i-ri:loader-2-fill animate-spin text-2xl ma />
  </template>
</template>
