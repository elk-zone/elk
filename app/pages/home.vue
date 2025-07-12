<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  alias: ['/signin/callback'],
})

const route = useRoute()
const router = useRouter()
if (import.meta.client && route.path === '/signin/callback')
  router.push('/home')

const { t } = useI18n()
useHydratedHead({
  title: () => t('nav.home'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <MainTitle as="router-link" to="/home" icon="i-ri:home-5-line">
        {{ $t('nav.home') }}
      </MainTitle>
    </template>

    <TimelineHome v-if="isHydrated" />
  </MainContent>
</template>
