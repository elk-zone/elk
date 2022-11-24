<script setup lang="ts">
const params = useRoute().params
const accountName = $computed(() => params.account as string)

const account = await fetchAccountByName(accountName)
const paginator = account ? masto.accounts.getFollowersIterable(account!.id!, {}) : null
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
