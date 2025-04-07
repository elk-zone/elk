<script setup lang="ts">
const { t } = useI18n()
const params = useRoute().params
const handle = computed(() => params.account as string)

definePageMeta({ name: 'account-following' })

const account = await fetchAccountByHandle(handle.value)
const paginator = account ? useMastoClient().v1.accounts.$select(account.id).following.list() : null

const isSelf = useSelfAccount(account)

if (account) {
  useHydratedHead({
    title: () => `${t('account.following')} | ${getDisplayName(account)} (@${account.acct})`,
  })

  const currentUserInstance = currentUser.value?.account.url.split('/@')[0]
  const accountInstance = account.url.split('/@')[0]

  if (currentUserInstance !== accountInstance) {
    const otherMasto = createMasto()
    otherMasto.setParams({ url: accountInstance })

    const otherAccount = await otherMasto.client.value.v1.accounts.lookup({ acct: account.acct })

    const otherPaginator = otherMasto.client.value.v1.accounts.listFollowing(otherAccount.id, {})

    console.log((await otherPaginator.next()).value)
  }
}
</script>

<template>
  <template v-if="paginator">
    <AccountPaginator :paginator="paginator" :relationship-context="isSelf ? 'following' : undefined" context="following" :account="account" />
  </template>
</template>
