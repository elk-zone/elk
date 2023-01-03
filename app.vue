<script setup lang="ts">
setupPageHeader()
provideGlobalCommands()

// We want to trigger rerendering the page when account changes
const key = computed(() =>
  `${currentServer.value}:${checkUser(currentUser.value) ? currentUser.value.account.id : GUEST_ID}`,
)
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />
  <NuxtLayout :key="key">
    <NuxtPage />
  </NuxtLayout>
  <AriaAnnouncer />
</template>
