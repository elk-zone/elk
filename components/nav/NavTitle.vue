<script setup lang="ts">
const env = useRuntimeConfig().public.env
const sub = env === 'local' ? 'dev' : env === 'staging' ? 'preview' : 'alpha'
</script>

<template>
  <!-- Use external to force refresh page and jump to top of timeline -->
  <NuxtLink flex px3 py2 items-center text-2xl gap-2 hover:bg-active focus-visible:ring="2 current" rounded-full to="/" external>
    <img :alt="$t('app_logo')" src="/logo.svg" w-10 h-10 height="40" width="40">
    <div>
      {{ $t('app_name') }} <sup text-sm italic text-secondary mt-1>{{ sub }}</sup>
    </div>
  </NuxtLink>
</template>
