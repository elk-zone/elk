<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

const params = useRoute().params
const masto = await useMasto()
const { data: account } = await useAsyncData('account', () => masto.accounts.lookup({ acct: params.user as string }))
const statuses = $(computedAsync(async () => account.value ? await masto.accounts.fetchStatuses(account.value.id).then(r => r.value) : [], []))
</script>

<template>
  <div>
    <AccountHeader :account="account" />
    <!-- TODO: Tabbed Posts + Posts and Replies + Media -->
    <TimelineList :timelines="statuses" />
  </div>
</template>
