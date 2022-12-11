<script setup lang="ts">
const route = useRoute()
const serverName = $(computedEager(() => route.params.server as string))
const accountName = $(computedEager(() => route.params.account as string))

const { t } = useI18n()

const { data: account, refresh } = $(await useAsyncData(
    `${serverName}:account:${accountName}`,
    () => fetchAccountByHandle(accountName, serverName).catch(() => null)),
)
const relationship = $computed(() => account ? useRelationship(account).value : undefined)

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
      <AccountMoved v-if="account.moved" :account="account" />
      <AccountHeader :account="account" command border="b base" :class="{ 'op-50 grayscale-50': !!account.moved }" />

      <div v-if="relationship?.blockedBy" h-30 flex="~ col center gap-2">
        <div text-secondary>
          {{ $t('account.profile_unavailable') }}
        </div>
        <div text-secondary-light text-sm>
          {{ $t('account.blocked_by') }}
        </div>
      </div>
      <NuxtPage v-else />
    </template>

    <CommonNotFound v-else>
      {{ $t('error.account_not_found', [`@${accountName}`]) }}
    </CommonNotFound>
  </MainContent>
</template>
