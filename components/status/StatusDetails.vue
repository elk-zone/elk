<script setup lang="ts">
import type { mastodon } from 'masto'

const props = withDefaults(defineProps<{
  status: mastodon.v1.Status
  command?: boolean
  actions?: boolean
}>(), {
  actions: true,
})

const userSettings = useUserSettings()

const status = $computed(() => {
  if (props.status.reblog && props.status.reblog)
    return props.status.reblog
  return props.status
})

const createdAt = useFormattedDateTime(status.createdAt)

const { t } = useI18n()

useHeadFixed({
  title: () => `${getDisplayName(status.account)} ${t('common.in')} ${t('app_name')}: "${removeHTMLTags(status.content) || ''}"`,
})

const {
  status: actionsStatus,
  toggleFavourite,
} = $(useStatusActions(props))
const isDM = $computed(() => status.visibility === 'direct')
const isSelf = $(useSelfAccount(() => actionsStatus?.account))
</script>

<template>
  <div :id="`status-${status.id}`" flex flex-col gap-2 pt2 pb1 ps-3 pe-4 relative :lang="status.language ?? undefined">
    <div v-if="isDM && !isSelf" inset-ie-2 top-2 absolute inline-flex flex-center>
      <div inline-flex>
        <StatusActionButton
          v-if="!isSelf"
          :content="$t('action.favourite')"
          color="text-rose" hover="text-rose" group-hover="bg-rose/10"
          icon="i-ri:heart-3-line"
          active-icon="i-ri:heart-3-fill"
          :active="!!actionsStatus.favourited"
          @click="toggleFavourite()"
        />
      </div>
      <StatusActionsMore :status="status" class="!ms0" />
    </div>
    <StatusActionsMore v-else :status="status" inset-ie-2 top-2 absolute />
    <NuxtLink :to="getAccountRoute(status.account)" rounded-full hover:bg-active transition-100 pe5 me-a>
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
          <span ms1 font-bold cursor-pointer>{{ $t('state.edited') }}</span>
        </StatusEditIndicator>
      </div>
      <div>&middot;</div>
      <StatusVisibilityIndicator :status="status" />
      <div v-if="status.application?.name">
        &middot;
      </div>
      <div v-if="status.application?.website && status.application.name">
        <NuxtLink :to="status.application.website">
          {{ status.application.name }}
        </NuxtLink>
      </div>
      <div v-else-if="status.application?.name">
        {{ status.application?.name }}
      </div>
    </div>
    <div border="t base" pt-2>
      <StatusActions v-if="actions" v-show="!userSettings.zenMode" :status="status" details :command="command" />
    </div>
  </div>
</template>
