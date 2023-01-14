<script setup lang="ts">
onMounted(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration()
      .then((registration) => {
        if (registration && registration.active) {
          // we need to signal the service worker that we are ready to receive data
          registration.active.postMessage({ action: 'ready-to-receive' })
        }
      })
      .catch(err => console.error('Could not get registration', err))
  }
})
</script>

<template>
  <MainContent>
    <p>Hello world</p>
  </MainContent>
</template>
