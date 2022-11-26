<script setup lang="ts">
const params = useRoute().params
const accountName = $computed(() => toShortHandle(params.account as string))

const account = await fetchAccountByName(accountName).catch(() => null)

if (account) {
  useHead({
    title: () => `${getDisplayName(account)} (@${account.acct})`,
  })
}
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
