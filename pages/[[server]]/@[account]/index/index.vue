<script setup lang="ts">
import type { mastodon } from 'masto'

const params = useRoute().params
const handle = computed(() => params.account as string)

definePageMeta({ name: 'account-index' })

const { t } = useI18n()

const account = await fetchAccountByHandle(handle.value)

// we need to ensure `pinned === true` on status
// because this prop is appeared only on current account's posts
function applyPinned(statuses: mastodon.v1.Status[]) {
  return statuses.map((status) => {
    status.pinned = true
    return status
  })
}

function reorderAndFilter(items: mastodon.v1.Status[]) {
  return reorderedTimeline(items, 'account')
}

const pinnedPaginator = useMastoClient().v1.accounts.$select(account.id).statuses.list({ pinned: true })
const postPaginator = useMastoClient().v1.accounts.$select(account.id).statuses.list({ limit: 30, excludeReplies: true })

if (account) {
  useHydratedHead({
    title: () => `${t('account.posts')} | ${getDisplayName(account)} (@${account.acct})`,
  })
}
</script>

<template>
  <div>
    <AccountTabs />
    <TimelinePaginator :paginator="pinnedPaginator" :preprocess="applyPinned" context="account" :account="account" :end-message="false" />
    <!-- Upper border -->
    <div h="1px" w-auto bg-border mb-1 />
    <TimelinePaginator :paginator="postPaginator" :preprocess="reorderAndFilter" context="account" :account="account" />
  </div>
</template>
