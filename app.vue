<script setup>
useHeader()
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <PWAPrompt />
</template>

<style>
html, body , #__nuxt{
  height: 100vh;
  margin: 0;
  padding: 0;
}

html.dark {
  color-scheme: dark;
}

html {
  --at-apply: bg-base text-base;
}
</style>
