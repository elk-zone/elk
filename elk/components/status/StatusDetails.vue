<script setup lang="ts">
import type { akkoma } from 'akko'

const props = withDefaults(defineProps<{
  status: akkoma.v1.Status
  newer?: akkoma.v1.Status
  command?: boolean
  actions?: boolean
}>(), {
  actions: true,
})

defineEmits<{
  (event: 'refetchStatus'): void
}>()

const status = computed(() => {
  if (props.status.reblog && props.status.reblog)
    return props.status.reblog
  return props.status
})

const {
  status: actionStatus,
  isLoading,
  canReblog,
  toggleBookmark,
  toggleReblog,
  toggleReact,
} = useStatusActions({ status: status.value })

const createdAt = useFormattedDateTime(status.value.createdAt)

const { t } = useI18n()

useHydratedHead({
  title: () => `${getDisplayName(status.value.account)} ${t('common.in')} ${t('app_name')}: "${removeHTMLTags(status.value.content) || ''}"`,
})
</script>

<template>
  <div :id="`status-${status.id}`" flex flex-col gap-2 pt2 pb1 ps-3 pe-4 relative :lang="status.language ?? undefined" aria-roledescription="status-details">
    <StatusActionsMore :status="status" :details="true" absolute inset-ie-2 top-2 @after-edit="$emit('refetchStatus')" />
    <NuxtLink :to="getAccountRoute(status.account)" rounded-full hover:bg-active transition-100 pe5 me-a>
      <AccountHoverWrapper :account="status.account">
        <AccountInfo :account="status.account" />
      </AccountHoverWrapper>
    </NuxtLink>
    <StatusContent :status="status" :newer="newer" context="details" />
    <div flex="~ gap-1" items-center justify-between text-secondary text-sm>
      <div flex="~ gap-1" items-center>
        <div flex shrink-0>
          <div>{{ createdAt }}</div>
          <StatusEditIndicator
            :status="status"
            :inline="false"
          >
            <span ms1 font-bold cursor-pointer>{{ $t('state.edited') }}</span>
          </StatusEditIndicator>
        </div>
        <div aria-hidden="true">
          &middot;
        </div>
        <StatusVisibilityIndicator :status="status" />
      </div>
      <div justify-self-end>
        <StatusEmojiReactions :status="actionStatus" />
      </div>
    </div>
    <div border="t base" py-2>
      <StatusActions v-if="actions" :status="actionStatus" details :command="command" :can-reblog="canReblog" :is-loading="isLoading" :toggle-bookmark="toggleBookmark" :toggle-react="toggleReact" :toggle-reblog="toggleReblog" />
    </div>
  </div>
</template>
