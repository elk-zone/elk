<script setup lang="ts">
import { useI18n } from 'vue-i18n'

definePageMeta({
  middleware: 'auth',
  alias: ['/signin/callback'],
})

if (useRoute().path === '/signin/callback') {
  // This only cleans up the URL; page content should stay the same
  useRouter().push('/home')
}

const paginator = useMasto().timelines.getHomeIterable()

const { t } = useI18n()
useHead({
  title: () => t('nav_side.home'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>{{ $t('nav_side.home') }}</span>
    </template>
    <slot>
      <PublishWidget draft-key="home" border="b base" />
      <TimelinePaginator :paginator="paginator" />
    </slot>
  </MainContent>
</template>
