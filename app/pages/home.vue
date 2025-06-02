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
      <NuxtLink to="/home" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:home-5-line />
        <span>{{ $t('nav.home') }}</span>
      </NuxtLink>
    </template>

    <TimelineHome v-if="isHydrated" />
  </MainContent>
</template>
