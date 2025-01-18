<script setup lang="ts">
definePageMeta({ name: 'account-media' })

const { t } = useI18n()
const params = useRoute().params
const handle = computed(() => params.account as string)

const account = await fetchAccountByHandle(handle.value)

const paginator = useMastoClient().v1.accounts.$select(account.id).statuses.list({ onlyMedia: true, excludeReplies: false })

if (account) {
  useHydratedHead({
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
