<script setup lang="ts">
const params = useRoute().params
const accountName = $computed(() => toShortHandle(params.account as string))

const account = await fetchAccountByName(accountName).catch(() => null)

const title = $computed(() =>
   `${(account?.displayName ?? '').replace(/\:\w+\:/g, '')} (@${account?.acct})`,
)

if (account)
  useHead({ title })
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
