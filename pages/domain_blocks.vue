<script setup lang="ts">
import TimelineDomainBlocks from '~~/components/timeline/TimelineDomainBlocks.vue'

definePageMeta({
  middleware: 'auth',
})

useHeadFixed({
  title: 'Blocked domains',
})
</script>

<template>
  <MainContent back>
    <template #title>
      <span text-lg font-bold>{{ $t('account.blocked_domains') }}</span>
    </template>

    <TimelineDomainBlocks v-if="isMastoInitialised" />
  </MainContent>
</template>
