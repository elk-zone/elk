<script setup lang="ts">
import type { Status } from 'masto'

const props = defineProps<{
  status: Status
}>()

const status = $computed(() => {
  if (props.status.reblog && props.status.reblog)
    return props.status.reblog
  return props.status
})

const formatter = Intl.DateTimeFormat(undefined, { dateStyle: 'long' })
const date = computed(() => formatter.format(new Date(status.createdAt)))
</script>

<template>
  <div flex flex-col gap-2 my-4 px-4>
    <AccountInfo :account="status.account" />
    <StatusReplyingTo :status="status" />
    <StatusBody :status="status" text-2xl />
    <StatusMedia
      v-if="status.mediaAttachments?.length"
      :status="status"
    />
    <div>
      <span op50 text-sm>
        {{ date }} · {{ status.application?.name || 'Unknown client' }}
      </span>
    </div>
    <StatusActions :status="status" border="t base" pt-2 />
  </div>
</template>
