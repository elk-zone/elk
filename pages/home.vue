<script setup lang="ts">
const token = useCookie('nuxtodon-token')
const router = useRouter()
if (!token.value)
  router.replace('/public')

const masto = await useMasto()
const paginator = masto.timelines.getHomeIterable()
</script>

<template>
  <MainContent>
    <template #title>
      <div i-ri:home-fill h-6 mr-1 /><span>Home</span>
    </template>
    <template #actions>
      <div color-gray i-ri:equalizer-fill mr-1 h-6 />
    </template>
    <slot>
      <TimelinePaginator :timelines="paginator" />
    </slot>
  </MainContent>
</template>
