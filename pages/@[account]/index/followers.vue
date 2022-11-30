<script setup lang="ts">
const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

const account = await fetchAccountByHandle(handle)
const paginator = account ? useMasto().accounts.getFollowersIterable(account.id, {}) : null
</script>

<template>
  <template v-if="account">
    <AccountPaginator :paginator="paginator" />
  </template>
</template>
