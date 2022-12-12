<script setup lang="ts">
setupPageHeader()
await setupI18n()
provideGlobalCommands()

// We want to trigger rerendering the page when account changes
const key = computed(() => `${currentServer.value}:${currentUser.value?.account.id || ''}`)
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />
  <NuxtLayout :key="key">
    <NuxtPage />
  </NuxtLayout>
  <TeleportTarget id="teleport-end" />
</template>
