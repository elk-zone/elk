<script setup lang="ts">
const params = useRoute().params
const user = $computed(() => params.user as string)

const { data: account } = await useAsyncData(`${user}:info`, () => masto.accounts.lookup({ acct: user }))
const paginator = masto.accounts.getFollowingIterable(account.value!.id!, {})
</script>

<template>
  <div>
    <AccountHeader :account="account" />
  </div>
  <AccountPaginator :paginator="paginator" />
</template>
