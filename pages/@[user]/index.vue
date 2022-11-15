<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean
}>()

const params = useRoute().params
const masto = await useMasto()
const { data: account } = await useAsyncData('account', () => masto.accounts.lookup({ acct: params.user as string }))
</script>

<template>
  <div>
    <AccountHeader :account="account" />
  </div>
</template>
