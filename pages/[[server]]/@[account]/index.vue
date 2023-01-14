<script setup lang="ts">
definePageMeta({
  key: route => `${route.params.server}:${route.params.account}`,
})

const params = useRoute().params
const accountName = $(computedEager(() => toShortHandle(params.account as string)))

const { t } = useI18n()

const { data: account, pending, refresh } = $(await useAsyncData(() => fetchAccountByHandle(accountName).catch(() => null), { watch: [isMastoInitialised], immediate: isMastoInitialised.value }))
const relationship = $computed(() => account ? useRelationship(account).value : undefined)

if (process.server) {
  const masto = useMasto()
  const route = useRoute()
  // render OG tags for crawlers
  const client = await masto.loginTo({
    server: route.params.server as string,
  })
  const account = await client.v1.accounts.lookup({ acct: accountName })
  if (account) {
    useHead({
      title: `${account.displayName || account.acct} ${t('common.in')} ${t('app_name')}`,
      meta: [
        { property: 'og:title', content: `${account.displayName} (${account.acct})` },
        { property: 'og:description', content: removeHTMLTags(account.note) || '' },
        { property: 'og:image', content: account.avatar },
      ],
    })
  }
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
      <ContentRich timeline-title-style :content="account ? getDisplayName(account) : t('nav.profile')" />
    </template>

    <template v-if="pending" />
    <template v-else-if="account">
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
