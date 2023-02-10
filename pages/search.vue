<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
useHeadFixed({
  title: () => t('nav.search'),
})
</script>

<template>
  <MainContent no-overflow-hidden>
    <template v-if="isHydrated" #title>
      <SearchWidget w-full m-1 />
    </template>
    <!-- TODO: put search result here -->
  </MainContent>
</template>
