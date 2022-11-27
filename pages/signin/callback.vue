<script setup lang="ts">
definePageMeta({
  layout: 'none',
})

const router = useRouter()
const { query } = useRoute()

onMounted(async () => {
  await loginTo(query as any)
  router.push('/')
})
</script>

<template>
  <div h-full flex>
    <div ma>
      Login...
    </div>
  </div>
</template>
