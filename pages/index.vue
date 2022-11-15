<script setup lang="ts">
const token = useCookie('nuxtodon-token')
const router = useRouter()
// TODO: move to middleware
if (!token.value)
  router.replace('/public')

const masto = await useMasto()
const paginator = masto.timelines.getHomeIterable()
</script>

<template>
  <TimelinePaginator :paginator="paginator" />
</template>
