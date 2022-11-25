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
    <StatusSpoiler :enabled="status.sensitive">
      <template #spoiler>
        {{ status.spoilerText }}
      </template>
      <StatusBody :status="status" text-2xl />
      <StatusMedia
        v-if="status.mediaAttachments?.length"
        :status="status"
      />
    </StatusSpoiler>
    <div>
      <span op50 text-sm>
        {{ date }} {{ status.application?.name ? `· ${status.application?.name}` : '' }}
      </span>
    </div>
    <StatusActions :status="status" border="t base" pt-2 />
  </div>
</template>
