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

const visibility = $computed(() => STATUS_VISIBILITIES.find(v => v.value === status.visibility)!)
</script>

<template>
  <div flex flex-col gap-2 py3 px-4>
    <AccountInfo :account="status.account" />
    <StatusReplyingTo v-if="status.inReplyToAccountId" :status="status" />
    <StatusSpoiler :enabled="status.sensitive">
      <template #spoiler>
        {{ status.spoilerText }}
      </template>
      <StatusBody :status="status" :with-action="false" text-2xl />
      <StatusMedia
        v-if="status.mediaAttachments?.length"
        :status="status"
      />
    </StatusSpoiler>
    <div flex="~ gap-1" items-center op50 text-sm>
      <div>{{ date }}</div>
      <div>·</div>
      <CommonTooltip :content="visibility.label" placement="bottom">
        <div :class="visibility.icon" />
      </CommonTooltip>
      <div v-if="status.application?.name">
        · {{ status.application?.name }}
      </div>
    </div>
    <StatusActions :status="status" border="t base" pt-2 />
  </div>
</template>
