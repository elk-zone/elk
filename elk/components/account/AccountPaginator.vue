<script setup lang="ts">
import type { mastodon } from 'masto'

const { paginator, account, context } = defineProps<{
  paginator: mastodon.Paginator<mastodon.v1.Account[], mastodon.DefaultPaginationParams | undefined>
  context?: 'following' | 'followers'
  account?: mastodon.v1.Account
  relationshipContext?: 'followedBy' | 'following'
}>()

const fallbackContext = computed(() => {
  return ['following', 'followers'].includes(context!)
})
const showOriginSite = computed(() =>
  account && account.id !== currentUser.value?.account.id && getServerName(account) !== currentServer.value,
)
</script>

<template>
  <CommonPaginator :paginator="paginator">
    <template #default="{ item }">
      <AccountCard
        :account="item"
        :relationship-context="relationshipContext"
        hover-card
        border="b base" py2 px4
      />
    </template>
    <template v-if="fallbackContext && showOriginSite" #done>
      <div p5 text-secondary text-center flex flex-col items-center gap1>
        <span italic>{{ $t(`account.view_other_${context}`) }}</span>
        <NuxtLink
          :href="account!.url" target="_blank" external
          flex="~ gap-1" items-center text-primary
          hover="underline text-primary-active"
        >
          <div i-ri:external-link-fill />
          {{ $t('menu.open_in_original_site') }}
        </NuxtLink>
      </div>
    </template>
  </CommonPaginator>
</template>
