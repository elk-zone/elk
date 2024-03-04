<script setup lang="ts">
definePageMeta({
  key: route => `${route.params.server ?? currentServer.value}:${route.params.account}`,
})

const params = useRoute().params
const accountName = computed(() => toShortHandle(params.account as string))

const { t } = useI18n()

const { data: account, pending, refresh } = await useAsyncData(() => fetchAccountByHandle(accountName.value).catch(() => null), { immediate: import.meta.client, default: () => shallowRef() })
const relationship = computed(() => account.value ? useRelationship(account.value).value : undefined)

const userSettings = useUserSettings()

onReactivated(() => {
  // Silently update data when reentering the page
  // The user will see the previous content first, and any changes will be updated to the UI when the request is completed
  refresh()
})
</script>

<template>
  <MainContent back>
    <template #title>
      <ContentRich
        timeline-title-style
        :content="account ? getDisplayName(account) : t('nav.profile')"
        :show-emojis="!getPreferences(userSettings, 'hideUsernameEmojis')"
        :markdown="false"
      />
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
