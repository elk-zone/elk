<script setup lang="ts">
const params = useRoute().params
const handle = $(computedEager(() => params.account as string))

definePageMeta({ name: 'account-following' })

const account = await fetchAccountByHandle(handle)
const paginator = account ? useMasto().accounts.getFollowingIterable(account.id, {}) : null
</script>

<template>
  <template v-if="account">
    <AccountPaginator :paginator="paginator" />
  </template>
</template>
