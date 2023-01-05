<script setup lang="ts">
import { buildInfo } from 'virtual:build-info'

const { env } = buildInfo
</script>

<template>
  <!-- Use external to force refresh page and jump to top of timeline -->
  <NuxtLink
    flex items-end gap-4
    py2 px-5
    text-2xl
    focus-visible:ring="2 current"
    to="/"
    external
  >
    <img :alt="$t('app_logo')" src="/logo.svg" shrink-0 aspect="1/1" sm:h-8 xl:h-10 class="rtl-flip">
    <div hidden xl:block>
      {{ $t('app_name') }} <sup text-sm italic text-secondary mt-1>{{ env === 'release' ? 'alpha' : env }}</sup>
    </div>
  </NuxtLink>
</template>
