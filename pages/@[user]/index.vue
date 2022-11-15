<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

const params = useRoute().params
const user = $computed(() => params.user as string)
const masto = await useMasto()
const { data: account } = await useAsyncData(`${user}:info`, () => masto.accounts.lookup({ acct: user }))
const { data: status } = await useAsyncData(`${user}:status`, () => masto.accounts.fetchStatuses(account.value!.id!))
</script>

<template>
  <div>
    <AccountHeader :account="account" />
  </div>
  <TimelineList :timelines="status?.value" />
</template>
