<script setup lang="ts">
import type { Account } from 'masto'
import AccountTabs from '~/components/account/AccountTabs.vue'

const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

definePageMeta({ name: 'account-index' })

const { t } = useI18n()

const { data: account } = await useAsyncData(`account:${handle}`, async () => (
  window.history.state?.account as Account | undefined)
    ?? await fetchAccountByHandle(handle),
)

const paginator = useMasto().accounts.iterateStatuses(account.value!.id, { excludeReplies: true })

if (account) {
  useHeadFixed({
    title: () => `${t('account.posts')} | ${getDisplayName(account.value!)} (@${account.value!.acct})`,
  })
}
</script>

<template>
  <div>
    <AccountTabs />
    <TimelinePaginator :paginator="paginator" :preprocess="timelineWithReorderedReplies" context="account" />
  </div>
</template>
