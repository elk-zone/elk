<script setup>
const sub = process.dev ? 'dev' : useRuntimeConfig().public.env === 'staging' ? 'preview' : 'alpha'
</script>

<template>
  <!-- Use external to force refresh page and jump to top of timeline -->
  <NuxtLink flex px3 py2 items-center text-2xl gap-2 hover:bg-active focus-visible:ring="2 current" rounded-full to="/" external>
    <img alt="Elk Logo" src="/logo.svg" w-10 h-10>
    <div>
      {{ $t('app_name') }} <sup text-sm italic text-secondary mt-1>{{ sub }}</sup>
    </div>
  </NuxtLink>
</template>
