<script setup lang="ts">
const { t } = useI18n()
useHydratedHead({
  title: () => t('nav.search'),
})

const search = ref<{ input?: HTMLInputElement }>()
watchEffect(() => {
  if (search.value?.input)
    search.value?.input?.focus()
})
onActivated(() =>
  search.value?.input?.focus(),
)
onDeactivated(() => search.value?.input?.blur())
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/search" timeline-title-style flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:search-line class="rtl-flip" />
        <span>{{ $t('nav.search') }}</span>
      </NuxtLink>
    </template>

    <div px2 mt3>
      <SearchWidget v-if="isHydrated" ref="search" m-1 />
    </div>
  </MainContent>
</template>
