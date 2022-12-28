<script setup lang="ts">
import type { Status } from 'masto'

const props = withDefaults(defineProps<{
  status: Status
  command?: boolean
  actions?: boolean
}>(), {
  actions: true,
})

const status = $computed(() => {
  if (props.status.reblog && props.status.reblog)
    return props.status.reblog
  return props.status
})

const createdAt = useFormattedDateTime(status.createdAt)

const visibility = $computed(() => STATUS_VISIBILITIES.find(v => v.value === status.visibility)!)

const { t } = useI18n()

useHeadFixed({
  title: () => `${status.account.displayName || status.account.acct} ${t('common.in')} ${t('app_name')}: "${removeHTMLTags(status.content) || ''}"`,
})

const isDM = $computed(() => status.visibility === 'direct')
</script>

<template>
  <div :id="`status-${status.id}`" flex flex-col gap-2 pt2 pb1 px-4 relative :lang="status.language ?? undefined" dir="auto">
    <StatusActionsMore :status="status" absolute right-2 top-2 />
    <NuxtLink :to="getAccountRoute(status.account)" rounded-full hover:bg-active transition-100 pr5 mr-a>
      <AccountHoverWrapper :account="status.account">
        <AccountInfo :account="status.account" />
      </AccountHoverWrapper>
    </NuxtLink>
    <StatusContent :status="status" context="details" />
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
      <div>&middot;</div>
      <CommonTooltip :content="$t(`visibility.${visibility.value}`)" placement="bottom">
        <div :class="visibility.icon" />
      </CommonTooltip>
      <div v-if="status.application?.name">
        &middot;
      </div>
      <div v-if="status.application?.name">
        {{ status.application?.name }}
      </div>
    </div>
    <div border="t base" pt-2>
      <StatusActions v-if="actions" :status="status" details :command="command" />
    </div>
  </div>
</template>
