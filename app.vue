<script setup>
import { APP_NAME } from './constants'

const isDev = process.dev
const isPreview = window.location.hostname.includes('deploy-preview')

useHead({
  titleTemplate: title => `${title ? `${title} | ` : ''}${APP_NAME}${isDev ? ' (dev)' : isPreview ? ' (preview)' : ''}`,
  link: [
    { rel: 'icon', type: 'image/svg+png', href: isDev || isPreview ? '/favicon-dev.png' : '/favicon.png' },
  ],
})

// We want to trigger rerendering the page when account changes
const key = computed(() => useMasto().instances.config.url || 'default')

// eslint-disable-next-line no-unused-expressions
isDark.value
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />
  <NuxtLayout :key="key">
    <NuxtPage />
  </NuxtLayout>
  <TeleportTarget
    id="teleport-end"
  />
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
