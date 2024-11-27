<script setup lang="ts">
import type { akkoma } from 'akko'

const router = useRouter()
const route = useRoute()

onMounted(async () => {
  // TODO: login check
  await openPublishDialog('intent', getDefaultDraftItem({
    status: route.query.text as string,
    sensitive: route.query.sensitive === 'true' || route.query.sensitive === null,
    spoilerText: route.query.spoiler_text as string,
    visibility: route.query.visibility as akkoma.v1.StatusVisibility,
    language: route.query.language as string,
  }), true)
  // TODO: need a better idea 👀
  await router.replace('/home')
})
</script>

<template>
  <div>
    <slot />
  </div>
</template>
