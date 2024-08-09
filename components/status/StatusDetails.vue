<script setup lang="ts">
import type { mastodon } from 'masto'

const props = withDefaults(defineProps<{
  status: mastodon.v1.Status
  newer?: mastodon.v1.Status
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
      <div aria-hidden="true">
        &middot;
      </div>
      <StatusVisibilityIndicator :status="status" />
      <div v-if="status.application?.name" aria-hidden="true">
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
    <div border="t base" py-2>
      <StatusActions v-if="actions" :status="status" details :command="command" />
    </div>
  </div>
</template>
