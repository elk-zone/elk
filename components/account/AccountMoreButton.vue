<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
}>()
let relationship = $(useRelationship(account))

const isSelf = $computed(() => currentUser.value?.account.id === account.id)

const toggleMute = async () => {
  // TODO: Add confirmation

  relationship!.muting = !relationship!.muting
  relationship = relationship!.muting
    ? await useMasto().accounts.mute(account.id, {
      // TODO support more options
    })
    : await useMasto().accounts.unmute(account.id)
}

const toggleBlockUser = async () => {
  // TODO: Add confirmation

  relationship!.blocking = !relationship!.blocking
  relationship = await useMasto().accounts[relationship!.blocking ? 'block' : 'unblock'](account.id)
}

const toggleBlockDomain = async () => {
  // TODO: Add confirmation

  relationship!.domainBlocking = !relationship!.domainBlocking
  await useMasto().domainBlocks[relationship!.domainBlocking ? 'block' : 'unblock'](getServerName(account))
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
          {{ $t('menu.open_in_original_site') }}
        </CommonDropdownItem>
      </NuxtLink>

      <template v-if="currentUser">
        <template v-if="!isSelf">
          <CommonDropdownItem icon="i-ri:at-line" @click="mentionUser(account)">
            {{ $t('menu.mention_account', [account.acct]) }}
          </CommonDropdownItem>
          <CommonDropdownItem icon="i-ri:message-3-line" @click="directMessageUser(account)">
            {{ $t('menu.direct_message_account', [account.acct]) }}
          </CommonDropdownItem>

          <CommonDropdownItem v-if="!relationship?.muting" icon="i-ri:volume-up-fill" @click="toggleMute">
            {{ $t('menu.mute_account', [account.acct]) }}
          </CommonDropdownItem>
          <CommonDropdownItem v-else icon="i-ri:volume-mute-line" @click="toggleMute">
            {{ $t('menu.unmute_account', [account.acct]) }}
          </CommonDropdownItem>

          <CommonDropdownItem v-if="!relationship?.blocking" icon="i-ri:forbid-2-line" @click="toggleBlockUser">
            {{ $t('menu.block_account', [account.acct]) }}
          </CommonDropdownItem>
          <CommonDropdownItem v-else icon="i-ri:checkbox-circle-line" @click="toggleBlockUser">
            {{ $t('menu.unblock_account', [account.acct]) }}
          </CommonDropdownItem>

          <template v-if="getServerName(account) !== currentServer">
            <CommonDropdownItem
              v-if="!relationship?.domainBlocking"
              icon="i-ri:shut-down-line"
              @click="toggleBlockDomain"
            >
              {{ $t('menu.block_domain', [getServerName(account)]) }}
            </CommonDropdownItem>
            <CommonDropdownItem v-else icon="i-ri:restart-line" @click="toggleBlockDomain">
              {{ $t('menu.unblock_domain', [getServerName(account)]) }}
            </CommonDropdownItem>
          </template>
        </template>

        <template v-else>
          <NuxtLink to="/pinned">
            <CommonDropdownItem icon="i-ri:pushpin-line">
              Pinned
            </CommonDropdownItem>
          </NuxtLink>
          <NuxtLink to="/favourites">
            <CommonDropdownItem icon="i-ri:heart-3-line">
              Favourites
            </CommonDropdownItem>
          </NuxtLink>
          <NuxtLink to="/mutes">
            <CommonDropdownItem icon="i-ri:volume-mute-line">
              Muted users
            </CommonDropdownItem>
          </NuxtLink>
          <NuxtLink to="/blocks">
            <CommonDropdownItem icon="i-ri:forbid-2-line">
              Blocked users
            </CommonDropdownItem>
          </NuxtLink>
          <NuxtLink to="/domain_blocks">
            <CommonDropdownItem icon="i-ri:shut-down-line">
              Blocked domains
            </CommonDropdownItem>
          </NuxtLink>
        </template>
      </template>
    </template>
  </CommonDropdown>
</template>
