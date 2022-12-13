<script setup lang="ts">
import type { Account } from 'masto'

definePageMeta({ name: 'account-media' })

const route = useRoute()
const handle = $(computedEager(() => route.params.account as string))

const { data: account } = await useAsyncData(`account:${handle}`, async () => (
  window.history.state?.account as Account | undefined)
    ?? await fetchAccountByHandle(handle),
)
const { t } = useI18n()

const paginator = useMasto().accounts.iterateStatuses(account.value!.id, { onlyMedia: true, excludeReplies: false })
</script>

<template>
  <div>
    <AccountTabs />
    <TimelinePaginator :paginator="paginator" context="account" />
  </div>
</template>
