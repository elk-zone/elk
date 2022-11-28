<script setup lang="ts">
import { useI18n } from 'vue-i18n'

definePageMeta({
  middleware: 'auth',
})

const paginator = useMasto().favourites.getIterator()
const { t } = useI18n()

useHead({
  title: () => t('nav_side.favourites'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>{{ t('nav_side.favourites') }}</span>
    </template>
    <slot>
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
