<script setup lang="ts">
definePageMeta({
  layout: 'none',
})

const { query } = useRoute()

onMounted(async () => {
  await loginTo(query as any)
})
</script>

<template>
  <div h-full flex>
    <div ma>
      Login...
    </div>
  </div>
</template>
