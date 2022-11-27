<script setup>
const sub = import.meta.env.DEV ? 'dev' : window.location.hostname.includes('deploy-preview') ? 'preview' : 'alpha'
</script>

<template>
  <!-- Use external to force refresh page and jump to top of timeline -->
  <NuxtLink flex px3 py2 items-center text-2xl gap-2 hover:bg-active focus-visible:ring="2 current" rounded-full to="/" external>
    <img aria-label="Elk Logo" src="/logo.svg" w-10 h-10>
    <div>
      Elk <sup text-sm italic text-secondary mt-1>{{ sub }}</sup>
    </div>
  </NuxtLink>
</template>
