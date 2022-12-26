<script lang="ts" setup>
const { lg } = breakpoints
</script>

<template>
  <MainContent :back="!lg">
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <span>{{ $t('settings.preferences.label') }}</span>
      </div>
    </template>
    <div text-center mt-10>
      <h1 text-4xl>
        🚧
      </h1>
      <h3 text-xl>
        {{ $t('settings.preferences.label') }}
      </h3>
    </div>
  </MainContent>
</template>
