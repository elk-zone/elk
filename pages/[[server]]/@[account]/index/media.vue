<script setup lang="ts">
import type { Account } from 'masto'

definePageMeta({ name: 'account-media' })

const { t } = useI18n()
const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

const account = await fetchAccountByHandle(handle)

const paginator = useMasto().accounts.iterateStatuses(account.id, { onlyMedia: true, excludeReplies: false })

if (account) {
  useHeadFixed({
    title: () => `${t('tab.media')} | ${getDisplayName(account)} (@${account.acct})`,
  })
}
</script>

<template>
  <div>
    <AccountTabs />
    <TimelinePaginator :paginator="paginator" :preprocess="reorderedTimeline" context="account" :account="account" />
  </div>
</template>
