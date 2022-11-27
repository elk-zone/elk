<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  alias: ['/signin/callback'],
})

if (useRoute().path === '/signin/callback') {
  // This only cleans up the URL; page content should stay the same
  useRouter().push('/home')
}

const paginator = useMasto().timelines.getHomeIterable()
const stream = await useMasto().stream.streamUser()
onBeforeUnmount(() => stream.disconnect())
</script>

<template>
  <MainContent>
    <template #title>
      <span text-lg font-bold>Home</span>
    </template>
    <slot>
      <PublishWidget draft-key="home" border="b base" />
      <TimelinePaginator { paginator, stream } />
    </slot>
  </MainContent>
</template>
