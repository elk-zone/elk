<script setup lang="ts">
const token = useCookie('nuxtodon-token')
const router = useRouter()
if (!token.value)
  router.replace('/public')

const masto = await useMasto()
const { data: timelines } = await useAsyncData('timelines-home', () => masto.timelines.fetchHome().then(r => r.value))
</script>

<template>
  <TimelineList :timelines="timelines" />
</template>
