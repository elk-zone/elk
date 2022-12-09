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

const paginator = $computed(() => useMasto()?.timelines?.iterateHome?.())
const stream = asyncComputed(async () => {
  return useMasto()?.stream?.streamUser?.()
})

watch(stream, (_, o) => {
  o?.disconnect?.()
})

onBeforeUnmount(() => stream.value?.disconnect?.())

const { t } = useI18n()
useHeadFixed({
  title: () => t('nav_side.home'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/home" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:home-5-line />
        <span>{{ $t('nav_side.home') }}</span>
      </NuxtLink>
    </template>
    <slot>
      <PublishWidget draft-key="home" border="b base" />
      <TimelinePaginator v-bind="{ paginator, stream }" context="home" />
    </slot>
  </MainContent>
</template>
