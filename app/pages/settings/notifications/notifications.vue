<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { t } = useI18n()

useHydratedHead({
  title: () => `${t('settings.notifications.notifications.label')} | ${t('settings.notifications.label')} | ${t('nav.settings')}`,
})
</script>

<template>
  <MainContent back>
    <template #title>
      <div text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:test-tube-line />
        <span>{{ $t('settings.notifications.notifications.label') }}</span>
      </div>
    </template>
    <div text-center mt-10>
      <h1 text-4xl>
        <span sr-only>{{ $t('settings.notifications.under_construction') }}</span>
        🚧
      </h1>
      <h3 text-xl>
        {{ $t('settings.notifications.notifications.label') }}
      </h3>
    </div>
  </MainContent>
</template>
