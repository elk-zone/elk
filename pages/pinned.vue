<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().accounts.iterateStatuses(currentUser.value!.account.id, { pinned: true })
const { t } = useI18n()

useHeadFixed({
  title: () => t('account.pinned'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:pushpin-line h-6 mr-1 />
      <span>{{ t('account.pinned') }}</span>
    </template>

    <TimelinePinned v-if="isMastoInitialised" />
  </MainContent>
</template>
