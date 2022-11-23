<script setup lang="ts">
const params = useRoute().params
const user = $computed(() => params.user as string)

const { data: account } = $(await useAsyncData(`${user}:info`, () => masto.accounts.lookup({ acct: user })))
const paginator = account ? masto.accounts.getFollowingIterable(account!.id!, {}) : null
</script>

<template>
  <template v-if="account">
    <div>
      <AccountHeader :account="account" />
    </div>
    <AccountPaginator :paginator="paginator" />
  </template>

  <CommonNotFound v-else>
    Account @{{ params.user }} not found
  </CommonNotFound>
</template>
