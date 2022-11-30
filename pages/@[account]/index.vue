<script setup lang="ts">
const params = useRoute().params
const accountName = $(computedEager(() => toShortHandle(params.account as string)))

const { t } = useI18n()

const { data: account, refresh } = $(await useAsyncData(() => fetchAccountByHandle(accountName).catch(() => null)))

if (account) {
  useHeadFixed({
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
      <span text-lg font-bold>{{ account ? getDisplayName(account) : t('nav_side.profile') }}</span>
    </template>

    <template v-if="account">
      <AccountHeader :account="account" command border="b base" />
      <NuxtPage />
    </template>

    <CommonNotFound v-else>
      {{ $t('error.account_not_found', [`@${accountName}`]) }}
    </CommonNotFound>
  </MainContent>
</template>
