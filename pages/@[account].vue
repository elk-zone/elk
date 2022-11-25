<script setup lang="ts">
const params = useRoute().params
const accountName = $computed(() => toShortHandle(params.account as string))

const account = await fetchAccountByName(accountName).catch(() => null)

if (account) {
  useHead({
    title: () => `${account.displayName?.replace(/\:\w+\:/g, '') ?? ''} (@${account.acct})`,
  })
}
</script>

<template>
  <MainContent>
    <template v-if="account">
      <AccountHeader :account="account" border="b base" />
      <NuxtPage />
    </template>

    <CommonNotFound v-else>
      Account @{{ accountName }} not found
    </CommonNotFound>
  </MainContent>
</template>
