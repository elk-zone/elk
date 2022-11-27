<script setup lang="ts">
definePageMeta({
  layout: 'none',
})

const router = useRouter()
const { query } = useRoute()

onMounted(async () => {
  // don't handle error here: this page has 'none' layout
  // it will be handled by the error page
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
