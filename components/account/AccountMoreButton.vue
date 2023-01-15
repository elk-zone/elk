<script setup lang="ts">
import type { mastodon } from 'masto'

const { account } = defineProps<{
  account: mastodon.v1.Account
  command?: boolean
}>()
let relationship = $(useRelationship(account))

const isSelf = $(useSelfAccount(() => account))

const { t } = useI18n()
const { client } = $(useMasto())

const isConfirmed = async (title: string) => {
  return await openConfirmDialog(t('common.confirm_dialog.title', [title])) === 'confirm'
}

const toggleMute = async (title: string) => {
  if (!await isConfirmed(title))
    return

  relationship!.muting = !relationship!.muting
  relationship = relationship!.muting
    ? await client.v1.accounts.mute(account.id, {
      // TODO support more options
    })
    : await client.v1.accounts.unmute(account.id)
}

const toggleBlockUser = async (title: string) => {
  if (!await isConfirmed(title))
    return

  relationship!.blocking = !relationship!.blocking
  relationship = await client.v1.accounts[relationship!.blocking ? 'block' : 'unblock'](account.id)
}

const toggleBlockDomain = async (title: string) => {
  if (!await isConfirmed(title))
    return

  relationship!.domainBlocking = !relationship!.domainBlocking
  await client.v1.domainBlocks[relationship!.domainBlocking ? 'block' : 'unblock'](getServerName(account))
}

const toggleReblogs = async (title: string) => {
  if (!await isConfirmed(title))
    return

  const showingReblogs = !relationship?.showingReblogs
  relationship = await client.v1.accounts.follow(account.id, { reblogs: showingReblogs })
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

      <template v-if="currentUser">
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
            v-if="!relationship?.showingReblogs"
            icon="i-ri:repeat-line"
            :text="$t('menu.show_reblogs', [`@${account.acct}`])"
            :command="command"
            @click="toggleReblogs($t('menu.show_reblogs', [`@${account.acct}`]))"
          />
          <CommonDropdownItem
            v-else
            :text="$t('menu.hide_reblogs', [`@${account.acct}`])"
            icon="i-ri:repeat-line"
            :command="command"
            @click="toggleReblogs($t('menu.hide_reblogs', [`@${account.acct}`]))"
          />

          <CommonDropdownItem
            v-if="!relationship?.muting"
            :text="$t('menu.mute_account', [`@${account.acct}`])"
            icon="i-ri:volume-up-fill"
            :command="command"
            @click="toggleMute($t('menu.mute_account', [`@${account.acct}`]))"
          />
          <CommonDropdownItem
            v-else
            :text="$t('menu.unmute_account', [`@${account.acct}`])"
            icon="i-ri:volume-mute-line"
            :command="command"
            @click="toggleMute($t('menu.unmute_account', [`@${account.acct}`]))"
          />

          <CommonDropdownItem
            v-if="!relationship?.blocking"
            :text="$t('menu.block_account', [`@${account.acct}`])"
            icon="i-ri:forbid-2-line"
            :command="command"
            @click="toggleBlockUser($t('menu.block_account', [`@${account.acct}`]))"
          />
          <CommonDropdownItem
            v-else
            :text="$t('menu.unblock_account', [`@${account.acct}`])"
            icon="i-ri:checkbox-circle-line"
            :command="command"
            @click="toggleBlockUser($t('menu.unblock_account', [`@${account.acct}`]))"
          />

          <template v-if="getServerName(account) !== currentServer">
            <CommonDropdownItem
              v-if="!relationship?.domainBlocking"
              :text="$t('menu.block_domain', [getServerName(account)])"
              icon="i-ri:shut-down-line"
              :command="command"
              @click="toggleBlockDomain($t('menu.block_domain', [getServerName(account)]))"
            />
            <CommonDropdownItem
              v-else
              :text="$t('menu.unblock_domain', [getServerName(account)])"
              icon="i-ri:restart-line"
              :command="command"
              @click="toggleBlockDomain($t('menu.unblock_domain', [getServerName(account)]))"
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
