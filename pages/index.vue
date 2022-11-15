<script setup lang="ts">
const token = useCookie('nuxtodon-token')
const router = useRouter()
if (!token.value)
  router.replace('/public')
else
  router.replace('/home')
</script>

<template>
  <div />
</template>
