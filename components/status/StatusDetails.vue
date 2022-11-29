<script setup lang="ts">
import type { Status } from 'masto'

const props = defineProps<{
  status: Status
  command?: boolean
}>()

const status = $computed(() => {
  if (props.status.reblog && props.status.reblog)
    return props.status.reblog
  return props.status
})

const createdAt = useFormattedDateTime(status.createdAt)

const visibility = $computed(() => STATUS_VISIBILITIES.find(v => v.value === status.visibility)!)
</script>

<template>
  <div :id="`status-${status.id}`" flex flex-col gap-2 py3 px-4>
    <NuxtLink :to="getAccountPath(status.account)" rounded-full hover:bg-active transition-100 pr5 mr-a>
      <AccountHoverWrapper :account="status.account">
        <AccountInfo :account="status.account" />
      </AccountHoverWrapper>
    </NuxtLink>
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
    <div flex="~ gap-1" items-center text-secondary text-sm>
      <div flex>
        <div>{{ createdAt }}</div>
        <StatusEditIndicator
          :status="status"
          :inline="false"
        >
          <span ml1 font-bold cursor-pointer>(Edited)</span>
        </StatusEditIndicator>
      </div>
      <div>·</div>
      <CommonTooltip :content="visibility.label" placement="bottom">
        <div :class="visibility.icon" />
      </CommonTooltip>
      <div v-if="status.application?.name">
        · {{ status.application?.name }}
      </div>
    </div>
    <StatusActions :status="status" details :command="command" border="t base" pt-2 />
  </div>
</template>
