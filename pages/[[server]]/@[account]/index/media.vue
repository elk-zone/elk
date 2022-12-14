<script setup lang="ts">
import type { Account } from 'masto'

definePageMeta({ name: 'account-media' })

const { t } = useI18n()
const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

const { data: account } = await useAsyncData(`account:${handle}`, async () => (
  window.history.state?.account as Account | undefined)
    ?? await fetchAccountByHandle(handle),
)

const paginator = useMasto().accounts.iterateStatuses(account.value!.id, { onlyMedia: true, excludeReplies: false })

if (account) {
  useHeadFixed({
    title: () => `${t('tab.media')} | ${getDisplayName(account.value!)} (@${account.value!.acct})`,
  })
}
</script>

<template>
  <div>
    <AccountTabs />
    <TimelinePaginator :paginator="paginator" context="account" />
  </div>
</template>
