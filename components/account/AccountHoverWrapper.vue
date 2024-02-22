<script setup lang="ts">
import type { mastodon } from 'masto'
import type { Ref } from 'vue'

type WatcherType = [acc?: mastodon.v1.Account, h?: string, v?: boolean]
type AccountType = mastodon.v1.Account | null | undefined | Ref<mastodon.v1.Account | null>

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  account?: mastodon.v1.Account
  handle?: string
  disabled?: boolean
}>()

const hoverCard = ref()
const targetIsVisible = ref(false)
const useAccount = ref<AccountType>(props.account)
const account = computed(() => unref(useAccount.value))

useIntersectionObserver(
  hoverCard,
  ([{ intersectionRatio }]) => {
    targetIsVisible.value = intersectionRatio <= 0.75
  },
)

watch(
  () => [props.account, props.handle, targetIsVisible.value] satisfies WatcherType,
  ([newAccount, newHandle, newVisible], oldProps) => {
    if (newAccount) {
      useAccount.value = newAccount
      return
    }

    if (!newVisible)
      return

    if (newHandle) {
      const [_oldAccount, oldHandle, _oldVisible] = oldProps ?? [undefined, undefined, false]
      if (!oldHandle || newHandle !== oldHandle || !account.value) {
        // @ts-expect-error just ignore
        useAccount.value = useAccountByHandle(newHandle)
      }

      return
    }

    useAccount.value = undefined
  }, { immediate: true, flush: 'post' },
)

// const account = computed(() => props.account || (props.handle ? useAccountByHandle(props.handle!) : undefined))
const userSettings = useUserSettings()
</script>

<template>
  <div ref="hoverCard">
    <VMenu
      v-if="!disabled && account && !getPreferences(userSettings, 'hideAccountHoverCard')"
      placement="bottom-start"
      :delay="{ show: 500, hide: 100 }"
      v-bind="$attrs"
      :close-on-content-click="false"
    >
      <slot />
      <template #popper>
        <AccountHoverCard v-if="account" :account="account" />
      </template>
    </VMenu>
    <slot v-else />
  </div>
</template>
