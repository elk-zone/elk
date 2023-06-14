<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  account?: mastodon.v1.Account
  handle?: string
  disabled?: boolean
}>()

const account = ref<mastodon.v1.Account | null>(null)

const userSettings = useUserSettings()

defineOptions({
  inheritAttrs: false,
})

onMounted(async () => {
  account.value = props.account || await fetchAccountByHandle(props.handle)
})
</script>

<template>
  <VMenu v-if="!disabled && account && !getPreferences(userSettings, 'hideAccountHoverCard')" placement="bottom-start" :delay="{ show: 500, hide: 100 }" v-bind="$attrs" :close-on-content-click="false">
    <slot />
    <template #popper>
      <AccountHoverCard v-if="account" :account="account" />
    </template>
  </VMenu>
  <slot v-else />
</template>
