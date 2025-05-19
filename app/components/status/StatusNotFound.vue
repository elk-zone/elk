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
      <div>{{ $t('error.status_not_found') }}</div>

      <NuxtLink v-if="originalUrl" :to="originalUrl" external target="_blank">
        <button btn-solid flex="~ center gap-2" text-sm px2 py1>
          <div i-ri:arrow-right-up-line />
          {{ $t('status.try_original_site') }}
        </button>
      </NuxtLink>
    </div>
  </CommonNotFound>
</template>
