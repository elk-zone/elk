<script setup lang="ts">
const paginator = $computed(() => useMasto()?.timelines?.iteratePublic?.())
const stream = asyncComputed(async () => {
  return useMasto()?.stream?.streamPublicTimeline?.()
})
watch(() => stream.value, (_, o) => {
  o?.disconnect?.()
})
onBeforeUnmount(() => stream.value?.disconnect?.())

const { t } = useI18n()

useHeadFixed({
  title: () => t('title.federated_timeline'),
})
</script>

<template>
  <MainContent>
    <template #title>
      <NuxtLink to="/public" text-lg font-bold flex items-center gap-2 @click="$scrollToTop">
        <div i-ri:group-2-line />
        <span>{{ t('title.federated_timeline') }}</span>
      </NuxtLink>
    </template>

    <slot>
      <TimelinePaginator v-bind="{ paginator, stream }" context="public" />
    </slot>
  </MainContent>
</template>
