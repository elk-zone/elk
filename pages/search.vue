<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
useHeadFixed({
  title: () => t('nav.search'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/search" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:search-line class="rtl-flip" />
        <span>{{ $t('nav.search') }}</span>
      </NuxtLink>
    </template>

    <SearchWidget v-if="isMastoInitialised" mt3 />
  </MainContent>
</template>
