<script setup lang="ts">
const params = useRoute().params
const serverName = $(computedEager(() => params.server as string))
const handle = $(computedEager(() => params.account as string))

definePageMeta({ name: 'account-followers' })

const account = await fetchAccountByHandle(handle, serverName)
const paginator = account ? useMasto().accounts.iterateFollowers(account.id, {}) : null
</script>

<template>
  <template v-if="account">
    <AccountPaginator :paginator="paginator" />
  </template>
</template>
