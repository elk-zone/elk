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
  <div :id="`status-${status.id}`" flex flex-col gap-2 py3 px-4 relative>
    <div v-if="status.inReplyToAccountId" absolute class="-top-3.5" left-2 bg-base pl-1 pb-1>
      <StatusReplyingTo :status="status" pt1 />
    </div>
    <div v-if="status.inReplyToAccountId" h-0.5 />
    <StatusActionsMore :status="status" absolute right-2 top-2 />
    <NuxtLink :to="getAccountRoute(status.account)" rounded-full hover:bg-active transition-100 pr5 mr-a>
      <AccountHoverWrapper :account="status.account">
        <AccountInfo :account="status.account" />
      </AccountHoverWrapper>
    </NuxtLink>
    <div
      :class="status.visibility === 'direct' ? 'my3 p2 px5 br2 bg-fade rounded-3 rounded-tl-none' : ''"
    >
      <StatusSpoiler :enabled="status.sensitive">
        <template #spoiler>
          <p text-2xl>
            {{ status.spoilerText }}
          </p>
        </template>
        <StatusBody :status="status" :with-action="false" text-2xl />
        <StatusPoll v-if="status.poll" :poll="status.poll" />
        <StatusMedia
          v-if="status.mediaAttachments?.length"
          :status="status"
        />
      </StatusSpoiler>
    </div>
    <div flex="~ gap-1" items-center text-secondary text-sm>
      <div flex>
        <div>{{ createdAt }}</div>
        <StatusEditIndicator
          :status="status"
          :inline="false"
        >
          <span ml1 font-bold cursor-pointer>{{ $t('state.edited') }}</span>
        </StatusEditIndicator>
      </div>
      <div>·</div>
      <CommonTooltip :content="$t(`visibility.${visibility.value}`)" placement="bottom">
        <div :class="visibility.icon" />
      </CommonTooltip>
      <div v-if="status.application?.name">
        · {{ status.application?.name }}
      </div>
    </div>
    <StatusActions :status="status" details :command="command" border="t base" pt-2 />
  </div>
</template>
