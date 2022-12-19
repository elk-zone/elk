<script setup lang="ts">
setupI18n()
setupLogging()
setupPageHeader()
provideGlobalCommands()

// We want to trigger rerendering the page when account changes
const key = computed(() => `${currentServer.value}:${currentUser.value?.account.id || ''}`)
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />
  <NuxtLayout :key="key">
    <NuxtPage v-if="isMastoInitialised" />
  </NuxtLayout>
  <AriaAnnouncer />
  <PWAPrompt />
</template>
