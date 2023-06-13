<script setup lang="ts">
const { t } = useI18n()
const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

definePageMeta({ name: 'account-followers' })

const account = await fetchAccountByHandle(handle)
const paginator = account ? useMastoClient().v1.accounts.listFollowers(account.id, {}) : null

const isSelf = account ? useSelfAccount(account) : undefined

if (account) {
  useHydratedHead({
    title: () => `${t('account.followers')} | ${getDisplayName(account)} (@${account.acct})`,
  })
}
</script>

<template>
  <template v-if="paginator && account">
    <AccountPaginator :paginator="paginator" :relationship-context="isSelf ? 'followedBy' : undefined" context="followers" :account="account" />
  </template>
</template>
