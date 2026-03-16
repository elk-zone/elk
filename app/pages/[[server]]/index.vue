<script setup lang="ts">
const instance = instanceStorage.value[currentServer.value]
try {
  clearError({ redirect: currentUser.value ? '/home' : `/${currentServer.value}/public/local` })
}
catch (err) {
  console.error(err)
}
</script>

<template>
  <MainContent text-base grid gap-3 m3>
    <img v-if="instance !== undefined" rounded-3 :src="instance.thumbnail.url">
  </MainContent>
</template>
