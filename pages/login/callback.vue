<script setup lang="ts">
definePageMeta({
  layout: 'none',
})

const { query } = useRoute()

onMounted(async () => {
  await loginCallback(query as any)
  await nextTick()
  await nextTick()
  location.pathname = '/'
})
</script>

<template>
  <div h-full flex>
    <div ma>
      Login...
    </div>
  </div>
</template>
