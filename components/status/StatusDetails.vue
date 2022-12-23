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

const { t } = useI18n()

useHeadFixed({
  title: () => `${status.account.displayName || status.account.acct} ${t('common.in')} ${t('app_name')}: "${removeHTMLTags(status.content) || ''}"`,
})

const isDM = $computed(() => status.visibility === 'direct')
</script>

<template>
  <div :id="`status-${status.id}`" flex flex-col gap-2 pt2 pb1 px-4 relative>
    <StatusActionsMore :status="status" absolute right-2 top-2 />
    <NuxtLink :to="getAccountRoute(status.account)" rounded-full hover:bg-active transition-100 pr5 mr-a>
      <AccountHoverWrapper :account="status.account">
        <AccountInfo :account="status.account" />
      </AccountHoverWrapper>
    </NuxtLink>
    <div
      space-y-3
      :class="{
        'pt2 pb0.5 px3.5 br2 bg-fade border-primary-light border-1 rounded-3': isDM,
      }"
    >
      <StatusSpoiler :enabled="status.sensitive">
        <template #spoiler>
          <p text-2xl>
            {{ status.spoilerText }}
          </p>
        </template>
        <StatusBody :status="status" :with-action="false" text-xl />
        <StatusPoll
          v-if="status.poll"
          :poll="status.poll"
        />
        <StatusMedia
          v-if="status.mediaAttachments?.length"
          :status="status"
          full-size
        />
        <StatusPreviewCard
          v-if="status.card"
          :card="status.card"
          :small-picture-only="status.mediaAttachments?.length > 0"
          mt-2
        />
        <div v-if="isDM" />
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
    <StatusActions :status="status" details :command="command" border="t base" pt-2 />
  </div>
</template>
