<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()
let relationship = $(useRelationship(account))

const isSelf = $computed(() => currentUser.value?.account.id === account.id)

const mute = async () => {
  // TODO: Add confirmation

  relationship!.muting = true
  relationship = await masto.accounts.mute(account.id, {
    // TODO support more options
  })
}

const unmute = async () => {
  // TODO: Add confirmation

  relationship!.muting = false
  relationship = await masto.accounts.unmute(account.id)
}

const block = async () => {
  // TODO: Add confirmation

  relationship!.blocking = true
  relationship = await masto.accounts.block(account.id)
}

const unblock = async () => {
  // TODO: Add confirmation

  relationship!.blocking = false
  relationship = await masto.accounts.unblock(account.id)
}
</script>

<template>
  <CommonDropdown>
    <button flex gap-1 items-center w-full rounded op75 hover="op100 text-purple" group>
      <div rounded-5 p2 group-hover="bg-purple/10">
        <div i-ri:more-2-fill />
      </div>
    </button>

    <template #popper>
      <NuxtLink :to="account.url" target="_blank">
        <CommonDropdownItem icon="i-ri:arrow-right-up-line">
          Open in original site
        </CommonDropdownItem>
      </NuxtLink>

      <template v-if="!isSelf">
        <CommonDropdownItem icon="i-ri:at-line" @click="mentionUser(account)">
          Mention @{{ account.acct }}
        </CommonDropdownItem>
        <CommonDropdownItem icon="i-ri:message-3-line" @click="directMessageUser(account)">
          Direct message @{{ account.acct }}
        </CommonDropdownItem>

        <CommonDropdownItem v-if="!relationship?.muting" icon="i-ri:volume-up-fill" @click="mute">
          Mute @{{ account.acct }}
        </CommonDropdownItem>
        <CommonDropdownItem v-else icon="i-ri:volume-mute-line" @click="unmute">
          Unmute @{{ account.acct }}
        </CommonDropdownItem>

        <CommonDropdownItem v-if="!relationship?.blocking" icon="i-ri:forbid-2-line" @click="block">
          Block @{{ account.acct }}
        </CommonDropdownItem>
        <CommonDropdownItem v-else icon="i-ri:checkbox-circle-line" @click="unblock">
          Unblock @{{ account.acct }}
        </CommonDropdownItem>
      </template>
    </template>
  </CommonDropdown>
</template>
