<script setup lang="ts">
import type { Account } from 'masto'
import AccountTabs from '~/components/account/AccountTabs.vue'

const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

definePageMeta({ name: 'account-index' })

const { t } = useI18n()

const account = await fetchAccountByHandle(handle)

const paginator = useMasto().accounts.iterateStatuses(account.id, { excludeReplies: true })

if (account) {
  useHeadFixed({
    title: () => `${t('account.posts')} | ${getDisplayName(account)} (@${account.acct})`,
  })
}
</script>

<template>
  <div>
    <AccountTabs />
    <TimelinePaginator :paginator="paginator" :preprocess="reorderedTimeline" context="account" :account="account" />
  </div>
</template>
