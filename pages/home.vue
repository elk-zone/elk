<script setup lang="ts">
const token = useCookie('nuxtodon-token')
const router = useRouter()
if (!token.value)
  router.replace('/public')

const masto = await useMasto()
const { data: timelines } = await useAsyncData('timelines-home', () => masto.timelines.fetchHome().then(r => r.value))
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
      <TimelineList :timelines="timelines" />
    </slot>
  </MainContent>
</template>
