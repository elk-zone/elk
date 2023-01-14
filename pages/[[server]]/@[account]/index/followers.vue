<script setup lang="ts">
const { t } = useI18n()
const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

definePageMeta({ name: 'account-followers' })

const account = await fetchAccountByHandle(handle)
const paginator = account ? useMasto().v1.accounts.listFollowers(account.id, {}) : null

const isSelf = useSelfAccount(account)

if (account) {
  useHeadFixed({
    title: () => `${t('account.followers')} | ${getDisplayName(account)} (@${account})`,
  })
}
</script>

<template>
  <template v-if="paginator">
    <AccountPaginator :paginator="paginator" :relationship-context="isSelf ? 'followedBy' : undefined" context="followers" :account="account" />
  </template>
</template>
