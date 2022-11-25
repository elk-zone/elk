<script setup lang="ts">
const params = useRoute().params
const accountName = $computed(() => params.account as string)

const account = await fetchAccountByName(accountName).catch(() => null)
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
