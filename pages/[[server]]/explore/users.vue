<script lang="ts" setup>
const { t } = useI18n()

// limit: 20 is the default configuration of the official client
const paginator = useMastoClient().v2.suggestions.list({ limit: 20 })

useHydratedHead({
  title: () => `${t('tab.for_you')} | ${t('nav.explore')}`,
})
</script>

<template>
  <CommonPaginator :paginator="paginator" key-prop="account">
    <template #default="{ item }">
      <AccountBigCard
        :account="item.account"
        as="router-link"
        :to="getAccountRoute(item.account)"
        border="b base"
      />
    </template>
    <template #loading>
      <AccountBigCardSkeleton border="b base" />
      <AccountBigCardSkeleton border="b base" op50 />
      <AccountBigCardSkeleton border="b base" op25 />
    </template>
  </CommonPaginator>
</template>
