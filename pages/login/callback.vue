<script setup lang="ts">
const { query } = useRoute()

onMounted(async () => {
  const { login } = useAppStore()
  await login(query as any)
  await nextTick()
  await nextTick()
  location.pathname = '/'
})
</script>

<template>
  <div>
    Login...
  </div>
</template>
