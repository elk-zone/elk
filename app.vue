<script setup lang="ts">
setupI18n()
setupPageHeader()
provideGlobalCommands()

// We want to trigger rerendering the page when account changes
const key = computed(() => `${currentUser.value?.server ?? currentServer.value}:${currentUser.value?.account.id || ''}`)

const { params } = useRoute()
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />
  <NuxtLayout :key="key">
    <!-- TODO: rework the /[account] routes to remove conditional loading -->
    <NuxtPage v-if="!params.server || isMastoInitialised" />
  </NuxtLayout>
  <PWAPrompt />
</template>
