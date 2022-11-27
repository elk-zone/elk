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
  catch (error) {
    showError({
      fatal: true,
      data: { noRetry: true },
      message: 'There was an error while signing in, please try again.',
    })
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
