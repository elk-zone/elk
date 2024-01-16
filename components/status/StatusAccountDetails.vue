<script setup lang="ts">
import type { mastodon } from 'masto'

const { status, link = true } = defineProps<{
  status: mastodon.v1.Status
  link?: boolean
}>()

const userSettings = useUserSettings()

const router = useRouter()
function goToAccount(account: mastodon.v1.Account) {
  if (!link)
    return

  setViewTransitionTarget({ account, status })
  router.push(getAccountRoute(account))
}
</script>

<template>
  <NuxtLink
    flex="~ col"
    min-w-0 items-start md:flex="~ row gap-2" md:items-center text-link-rounded
    @click="goToAccount(status.account)"
  >
    <AccountDisplayName :account="status.account" :hide-emojis="getPreferences(userSettings, 'hideUsernameEmojis')" font-bold line-clamp-1 ws-pre-wrap break-all />
    <AccountHandle :account="status.account" class="zen-none" />
  </NuxtLink>
</template>
