<script setup lang="ts">
const { account, status } = defineProps<{
  account: string
  status: string
}>()

const originalUrl = computed(() => {
  const [handle, _server] = account.split('@')
  const server = _server || currentUser.value?.server
  if (!server)
    return null

  return `https://${server}/@${handle}/${status}`
})
</script>

<template>
  <CommonNotFound>
    <div flex="~ col center gap2">
      <div>Status not found</div>

      <NuxtLink v-if="originalUrl" :to="originalUrl" target="_blank">
        <button btn-solid flex="~ center gap-2" px2 py1>
          <div i-ri:arrow-right-up-line />
          Try original site
        </button>
      </NuxtLink>
    </div>
  </CommonNotFound>
</template>
