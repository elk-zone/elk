<script setup lang="ts">
definePageMeta({ name: 'account-replies' })

const { t } = useI18n()
const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

const account = await fetchAccountByHandle(handle)

const paginator = account ? useMastoClient().v1.accounts.listStatuses(account.id, { excludeReplies: false }) : undefined

if (account) {
  useHydratedHead({
    title: () => `${t('tab.posts_with_replies')} | ${getDisplayName(account)} (@${account.acct})`,
  })
}
</script>

<template>
  <div>
    <AccountTabs />
    <template v-if="paginator && account">
      <TimelinePaginator :paginator="paginator" :preprocess="reorderedTimeline" context="account" :account="account" />
    </template>
  </div>
</template>
