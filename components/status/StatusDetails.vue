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

const date = useFormattedDateTime(status.createdAt)
</script>

<template>
  <div flex flex-col gap-2 py3 px-4>
    <AccountInfo :account="status.account" />
    <StatusReplyingTo v-if="status.inReplyToAccountId" :status="status" />
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
