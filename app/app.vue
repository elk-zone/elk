<script setup lang="ts">
setupPageHeader()
provideGlobalCommands()

const route = useRoute()

if (import.meta.server && !route.path.startsWith('/settings')) {
  const url = useRequestURL()

  useHead({
    meta: [
      { property: 'og:url', content: `${url.origin}${route.path}` },
    ],
  })
}

// We want to trigger rerendering the page when account changes
const key = computed(() => `${currentUser.value?.server ?? currentServer.value}:${currentUser.value?.account.id || ''}`)
</script>

<template>
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,var(--c-primary) 0%,var(--c-primary-active) 100%)" />
  <NuxtLayout :key="key">
    <NuxtPage />
  </NuxtLayout>
  <AriaAnnouncer />

  <!-- Avatar Mask -->
  <svg absolute op0 width="0" height="0">
    <defs>
      <clipPath id="avatar-mask" clipPathUnits="objectBoundingBox">
        <path d="M 0,0.5 C 0,0 0,0 0.5,0 S 1,0 1,0.5 1,1 0.5,1 0,1 0,0.5" />
      </clipPath>
    </defs>
  </svg>
</template>
