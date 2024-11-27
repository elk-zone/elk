<script setup lang="ts">
import type { akkoma } from 'akko'

const params = useRoute().params
const handle = computed(() => params.account as string)

definePageMeta({ name: 'account-index' })

const { t } = useI18n()

const account = await fetchAccountByHandle(handle.value)

function reorderAndFilter(items: akkoma.v1.Status[]) {
  return reorderedTimeline(items, 'account')
}

const paginator = useAkkoClient().v1.accounts.$select(account.id).statuses.list({ limit: 30, excludeReplies: true })

if (account) {
  useHydratedHead({
    title: () => `${t('account.posts')} | ${getDisplayName(account)} (@${account.acct})`,
  })
}
</script>

<template>
  <div>
    <AccountTabs />
    <TimelinePaginator :paginator="paginator" :preprocess="reorderAndFilter" context="account" :account="account" />
  </div>
</template>
