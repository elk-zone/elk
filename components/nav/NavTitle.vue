<script setup lang="ts">
const env = useRuntimeConfig().public.env
const sub = env === 'local' ? 'dev' : env === 'staging' ? 'preview' : 'alpha'
</script>

<template>
  <!-- Use external to force refresh page and jump to top of timeline -->
  <NuxtLink
    flex items-end gap-2
    w-fit
    py2 px-2 xl:px-3
    text-2xl hover:bg-active
    focus-visible:ring="2 current"
    rounded-full
    to="/"
    external
  >
    <img :alt="$t('app_logo')" src="/logo.svg" shrink-0 aspect="1/1" sm:h-8 xl:h-10 class="rtl-flip">
    <div hidden xl:block>
      {{ $t('app_name') }} <sup text-sm italic text-secondary mt-1>{{ sub }}</sup>
    </div>
  </NuxtLink>
</template>
