<script lang="ts" setup>
const { t } = useI18n()

// limit: 20 is the default configuration of the official client
const { data, pending, error } = useLazyAsyncData(
  () => useMasto().suggestions.fetchAll({ limit: 20 }),
  { immediate: true },
)

useHeadFixed({
  title: () => `${t('tab.for_you')} | ${t('nav_side.explore')}`,
})
</script>

<template>
  <div v-if="data && data.length">
    <AccountBigCard
      v-for="suggestion of data"
      :key="suggestion.account.id"
      :account="suggestion.account"
      as="router-link"
      :to="getAccountRoute(suggestion.account)"
      border="b base"
    />

    <div p5 text-center text-secondary-light italic>
      {{ $t('common.end_of_list') }}
    </div>
  </div>
  <div v-else-if="pending">
    <AccountBigCardSkeleton border="b base" />
    <AccountBigCardSkeleton border="b base" op50 />
    <AccountBigCardSkeleton border="b base" op25 />
  </div>
  <div v-else-if="error" p5 text-center text-red italic>
    {{ $t('common.error') }}: {{ error }}
  </div>
  <div v-else p5 text-center text-secondary italic>
    {{ $t('common.not_found') }}
  </div>
</template>
