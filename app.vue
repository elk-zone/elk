<script setup>
import { APP_NAME } from './constants'

useHead({
  title: APP_NAME,
  link: [
    {
      rel: 'icon', type: 'image/svg+xml', href: '/logo.svg',
    },
  ],
})

// eslint-disable-next-line no-unused-expressions
isDark.value
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
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
