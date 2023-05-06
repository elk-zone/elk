<script setup lang="ts">
const { t } = useI18n()

const search = $ref<{ input?: HTMLInputElement }>()
const route = useRoute()
watchEffect(() => {
  if (isMediumOrLargeScreen && route.name === 'search' && search?.input)
    search?.input?.focus()
})
onActivated(() =>
  search?.input?.focus(),
)
onDeactivated(() => search?.input?.blur())

useHydratedHead({
  title: () => `${t('nav.search')}`,
})

const userSettings = useUserSettings()
</script>

<template>
  <MainContent :no-overflow-hidden="isExtraLargeScreen" :back-on-small-screen="isExtraLargeScreen">
    <template v-if="!isExtraLargeScreen" #title>
      <span timeline-title-style flex items-center gap-2 cursor-pointer @click="$scrollToTop">
        <div i-ri:search-line />
        <span>{{ t('nav.search') }}</span>
      </span>
    </template>
    <template v-else #title>
      <SearchWidget v-if="isHydrated" ref="search" class="m-1" />
    </template>
    <NuxtPage v-if="isHydrated" />
  </MainContent>
</template>
