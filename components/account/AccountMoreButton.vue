<script setup lang="ts">
import type { Account } from 'masto'

const { account } = defineProps<{
  account: Account
  command?: boolean
}>()
let relationship = $(useRelationship(account))

const isSelf = $computed(() => checkAuth(currentUser.value) && currentUser.value.account.id === account.id)

const masto = useMasto()
const toggleMute = async () => {
  // TODO: Add confirmation

  relationship!.muting = !relationship!.muting
  relationship = relationship!.muting
    ? await masto.accounts.mute(account.id, {
      // TODO support more options
    })
    : await masto.accounts.unmute(account.id)
}

const toggleBlockUser = async () => {
  // TODO: Add confirmation

  relationship!.blocking = !relationship!.blocking
  relationship = await masto.accounts[relationship!.blocking ? 'block' : 'unblock'](account.id)
}

const toggleBlockDomain = async () => {
  // TODO: Add confirmation

  relationship!.domainBlocking = !relationship!.domainBlocking
  await masto.domainBlocks[relationship!.domainBlocking ? 'block' : 'unblock'](getServerName(account))
}
</script>

<template>
  <CommonDropdown :eager-mount="command">
    <button flex gap-1 items-center w-full rounded op75 hover="op100 text-purple" group aria-label="More actions">
      <div rounded-5 p2 group-hover="bg-purple/10">
        <div i-ri:more-2-fill />
      </div>
    </button>

    <template #popper>
      <NuxtLink :to="account.url" external target="_blank">
        <CommonDropdownItem
          :text="$t('menu.open_in_original_site')"
          icon="i-ri:arrow-right-up-line"
          :command="command"
        />
      </NuxtLink>

      <template v-if="!isGuest">
        <template v-if="!isSelf">
          <CommonDropdownItem
            :text="$t('menu.mention_account', [`@${account.acct}`])"
            icon="i-ri:at-line"
            :command="command"
            @click="mentionUser(account)"
          />
          <CommonDropdownItem
            :text="$t('menu.direct_message_account', [`@${account.acct}`])"
            icon="i-ri:message-3-line"
            :command="command"
            @click="directMessageUser(account)"
          />

          <CommonDropdownItem
            v-if="!relationship?.muting"
            :text="$t('menu.mute_account', [`@${account.acct}`])"
            icon="i-ri:volume-up-fill"
            :command="command"
            @click="toggleMute"
          />
          <CommonDropdownItem
            v-else
            :text="$t('menu.unmute_account', [`@${account.acct}`])"
            icon="i-ri:volume-mute-line"
            :command="command"
            @click="toggleMute"
          />

          <CommonDropdownItem
            v-if="!relationship?.blocking"
            :text="$t('menu.block_account', [`@${account.acct}`])"
            icon="i-ri:forbid-2-line"
            :command="command"
            @click="toggleBlockUser"
          />
          <CommonDropdownItem
            v-else
            :text="$t('menu.unblock_account', [`@${account.acct}`])"
            icon="i-ri:checkbox-circle-line"
            :command="command"
            @click="toggleBlockUser"
          />

          <template v-if="getServerName(account) !== currentServer">
            <CommonDropdownItem
              v-if="!relationship?.domainBlocking"
              :text="$t('menu.block_domain', [getServerName(account)])"
              icon="i-ri:shut-down-line"
              :command="command"
              @click="toggleBlockDomain"
            />
            <CommonDropdownItem
              v-else
              :text="$t('menu.unblock_domain', [getServerName(account)])"
              icon="i-ri:restart-line"
              :command="command"
              @click="toggleBlockDomain"
            />
          </template>
        </template>

        <template v-else>
          <NuxtLink to="/pinned">
            <CommonDropdownItem :text="$t('account.pinned')" icon="i-ri:pushpin-line" :command="command" />
          </NuxtLink>
          <NuxtLink to="/favourites">
            <CommonDropdownItem :text="$t('account.favourites')" icon="i-ri:heart-3-line" :command="command" />
          </NuxtLink>
          <NuxtLink to="/mutes">
            <CommonDropdownItem :text="$t('account.muted_users')" icon="i-ri:volume-mute-line" :command="command" />
          </NuxtLink>
          <NuxtLink to="/blocks">
            <CommonDropdownItem :text="$t('account.blocked_users')" icon="i-ri:forbid-2-line" :command="command" />
          </NuxtLink>
          <NuxtLink to="/domain_blocks">
            <CommonDropdownItem :text="$t('account.blocked_domains')" icon="i-ri:shut-down-line" :command="command" />
          </NuxtLink>
        </template>
      </template>
    </template>
  </CommonDropdown>
</template>
