<script setup lang="ts">
const params = useRoute().params
const accountName = $(computedEager(() => toShortHandle(params.account as string)))

const { data: account, refresh } = $(await useAsyncData(() => fetchAccountByName(accountName).catch(() => null)))

if (account) {
  useHead({
    title: () => `${getDisplayName(account)} (@${account.acct})`,
  })
}

onReactivated(() => {
  // Silently update data when reentering the page
  // The user will see the previous content first, and any changes will be updated to the UI when the request is completed
  refresh()
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ account ? getDisplayName(account) : 'Profile' }}</span>
    </template>

    <template v-if="account">
      <AccountHeader :account="account" border="b base" />
      <NuxtPage />
    </template>

    <CommonNotFound v-else>
      Account @{{ accountName }} not found
    </CommonNotFound>
  </MainContent>
</template>
