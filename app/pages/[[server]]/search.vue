<script setup lang="ts">
const keys = useMagicKeys()
const { t } = useI18n()

useHydratedHead({
  title: () => t('nav.search'),
})

const search = ref<{ input?: HTMLInputElement }>()

watchEffect(() => {
  if (search.value?.input)
    search.value?.input?.focus()
})
onActivated(() => search.value?.input?.focus())
onDeactivated(() => search.value?.input?.blur())

watch(keys['/'], (v) => {
  // focus on input when '/' is up to avoid '/' being typed
  if (!v)
    search.value?.input?.focus()
})
</script>

<template>
  <MainContent>
    <template #title>
      <MainTitle as="router-link" to="/search" icon="i-ri:search-line rtl-flip">
        {{ $t('nav.search') }}
      </MainTitle>
    </template>

    <div px2 mt3>
      <SearchWidget v-if="isHydrated" ref="search" m-1 />
    </div>
  </MainContent>
</template>
