<script setup lang="ts">
import type { mastodon } from 'masto'

const { account, list } = defineProps<{
  account: mastodon.v1.Account
  hoverCard?: boolean
  list: string
}>()

cacheAccount(account)

const client = useMastoClient()

const isRemoved = ref(false)

async function edit() {
  try {
    if (isRemoved.value)
      await client.v1.lists.$select(list).accounts.create({ accountIds: [account.id] })
    else
      await client.v1.lists.$select(list).accounts.remove({ accountIds: [account.id] })
    isRemoved.value = !isRemoved.value
  }
  catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div flex justify-between hover:bg-active transition-100 items-center>
    <AccountInfo
      :account="account" hover p1 as="router-link"
      :hover-card="hoverCard"
      shrink
      overflow-hidden
      :to="getAccountRoute(account)"
    />
    <div>
      <CommonTooltip
        :content="isRemoved ? $t('list.add_account') : $t('list.remove_account')"
        :hover="isRemoved ? 'text-green' : 'text-red'"
      >
        <button
          text-sm p2 border-1 transition-colors
          border-dark
          btn-action-icon
          @click="edit"
        >
          <span :class="isRemoved ? 'i-ri:user-add-line' : 'i-ri:user-unfollow-line'" />
        </button>
      </CommonTooltip>
    </div>
  </div>
</template>
