<script setup>
import { APP_NAME } from './constants'

useHead({
  titleTemplate: title => `${title ? `${title} | ` : ''}${APP_NAME}${import.meta.env.DEV ? ' (dev)' : ''}`,
  link: [
    {
      rel: 'icon', type: 'image/svg+png', href: '/favicon.png',
    },
  ],
})

// eslint-disable-next-line no-unused-expressions
isDark.value
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />
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
