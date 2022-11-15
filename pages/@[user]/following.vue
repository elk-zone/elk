<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

const params = useRoute().params
const user = $computed(() => params.user as string)
const masto = await useMasto()
const { data: account } = await useAsyncData(`${user}:info`, () => masto.accounts.lookup({ acct: user }))
const paginator = masto.accounts.getFollowingIterable(account.value!.id!, {})
</script>

<template>
  <div>
    <AccountHeader :account="account" />
  </div>
  <AccountPaginator :paginator="paginator" />
</template>
