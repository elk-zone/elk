<script setup lang="ts">
definePageMeta({
  layout: 'none',
})

const router = useRouter()
const { query } = useRoute()

onMounted(async () => {
  try {
    await loginTo(query as any)
  }
  catch (err) {
    // CLEANUP: remove this console.log
    console.error('Error while logging in:', err)
    showError(err as Error)
    return
  }
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
