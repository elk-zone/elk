<script lang="ts" setup>
// limit: 20 is the default configuration of the official client
const { data, pending } = useLazyAsyncData(
  () => useMasto().suggestions.fetchAll({ limit: 20 }),
  { immediate: true },
)
</script>

<template>
  <div v-if="data">
    <AccountBigCard
      v-for="suggestion of data"
      :key="suggestion.account.id"
      :account="suggestion.account"
      as="router-link"
      :to="getAccountRoute(suggestion.account)"
      border="b-2 base"
    />
  </div>
  <div v-else-if="pending">
    <StatusCardSkeleton border="b base" />
    <StatusCardSkeleton border="b base" op50 />
    <StatusCardSkeleton border="b base" op25 />
  </div>
</template>
