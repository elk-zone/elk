<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()

const editedAt = $computed(() => status.editedAt)
const formatted = useFormattedDateTime(status.editedAt)
</script>

<template>
  <CommonTooltip v-if="editedAt" :content="`Edited ${formatted}`">
    <time
      :title="editedAt"
      :datetime="editedAt"
      font-bold underline decoration-dashed
    >&nbsp;*</time>
  </CommonTooltip>
</template>
