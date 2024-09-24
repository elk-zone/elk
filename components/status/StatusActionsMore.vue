<script setup lang="ts">
import type { mastodon } from 'masto'
import { toggleBlockAccount, toggleMuteAccount, useRelationship } from '~~/composables/masto/relationship'

const props = defineProps<{
  status: mastodon.v1.Status
  details?: boolean
  command?: boolean
}>()

const emit = defineEmits<{
  (event: 'afterEdit'): void
}>()

const focusEditor = inject<typeof noop>('focus-editor', noop)

const {
  status,
  isLoading,
  toggleBookmark,
  toggleFavourite,
  togglePin,
  toggleReblog,
  toggleMute,
} = useStatusActions(props)

const clipboard = useClipboard()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const userSettings = useUserSettings()
const useStarFavoriteIcon = usePreferences('useStarFavoriteIcon')

const isAuthor = computed(() => status.value.account.id === currentUser.value?.account.id)

const { client } = useMasto()

function getPermalinkUrl(status: mastodon.v1.Status) {
  const url = getStatusPermalinkRoute(status)
  if (url)
    return `${location.origin}/${url}`
  return null
}

async function copyLink(status: mastodon.v1.Status) {
  const url = getPermalinkUrl(status)
  if (url)
    await clipboard.copy(url)
}

async function copyOriginalLink(status: mastodon.v1.Status) {
  const url = status.url
  if (url)
    await clipboard.copy(url)
}

const { share, isSupported: isShareSupported } = useShare()
async function shareLink(status: mastodon.v1.Status) {
  const url = getPermalinkUrl(status)
  if (url)
    await share({ url })
}

async function deleteStatus() {
  const confirmDelete = await openConfirmDialog({
    title: t('confirm.delete_posts.title'),
    description: t('confirm.delete_posts.description'),
    confirm: t('confirm.delete_posts.confirm'),
    cancel: t('confirm.delete_posts.cancel'),
  })
  if (confirmDelete.choice !== 'confirm')
    return

  removeCachedStatus(status.value.id)
  await client.value.v1.statuses.$select(status.value.id).remove()

  if (route.name === 'status')
    router.back()

  // TODO when timeline, remove this item
}

async function deleteAndRedraft() {
  const confirmDelete = await openConfirmDialog({
    title: t('confirm.delete_posts.title'),
    description: t('confirm.delete_posts.description'),
    confirm: t('confirm.delete_posts.confirm'),
    cancel: t('confirm.delete_posts.cancel'),
  })
  if (confirmDelete.choice !== 'confirm')
    return

  if (import.meta.dev) {
    // eslint-disable-next-line no-alert
    const result = confirm('[DEV] Are you sure you want to delete and re-draft this post?')
    if (!result)
      return
  }

  removeCachedStatus(status.value.id)
  await client.value.v1.statuses.$select(status.value.id).remove()
  await openPublishDialog('dialog', await getDraftFromStatus(status.value), true)

  // Go to the new status, if the page is the old status
  if (lastPublishDialogStatus.value && route.name === 'status')
    router.push(getStatusRoute(lastPublishDialogStatus.value))
}

function reply() {
  if (!checkLogin())
    return
  if (props.details) {
    focusEditor()
  }
  else {
    const { key, draft } = getReplyDraft(status.value)
    openPublishDialog(key, draft())
  }
}

async function editStatus() {
  await openPublishDialog(`edit-${status.value.id}`, {
    ...await getDraftFromStatus(status.value),
    editingStatus: status.value,
  }, true)
  emit('afterEdit')
}

function showFavoritedAndBoostedBy() {
  openFavoridedBoostedByDialog(status.value.id)
}
</script>

<template>
  <CommonDropdown flex-none ms3 placement="bottom" :eager-mount="command">
    <StatusActionButton
      :content="$t('action.more')"
      color="text-primary"
      hover="text-primary"
      elk-group-hover="bg-primary-light"
      icon="i-ri:more-line"
      my--2
    />

    <template #popper>
      <div flex="~ col">
        <template v-if="getPreferences(userSettings, 'zenMode') && !details">
          <CommonDropdownItem
            is="button"
            :text="$t('action.reply')"
            icon="i-ri:chat-1-line"
            :command="command"
            @click="reply()"
          />

          <CommonDropdownItem
            is="button"
            :text="status.reblogged ? $t('action.boosted') : $t('action.boost')"
            icon="i-ri:repeat-fill"
            :class="status.reblogged ? 'text-green' : ''"
            :command="command"
            :disabled="isLoading.reblogged"
            @click="toggleReblog()"
          />

          <CommonDropdownItem
            is="button"
            :text="status.favourited ? $t('action.favourited') : $t('action.favourite')"
            :icon="useStarFavoriteIcon
              ? status.favourited ? 'i-ri:star-fill' : 'i-ri:star-line'
              : status.favourited ? 'i-ri:heart-3-fill' : 'i-ri:heart-3-line'"
            :class="status.favourited
              ? useStarFavoriteIcon ? 'text-yellow' : 'text-rose'
              : ''
            "
            :command="command"
            :disabled="isLoading.favourited"
            @click="toggleFavourite()"
          />

          <CommonDropdownItem
            is="button"
            :text="status.bookmarked ? $t('action.bookmarked') : $t('action.bookmark')"
            :icon="status.bookmarked ? 'i-ri:bookmark-fill' : 'i-ri:bookmark-line'"
            :class="status.bookmarked
              ? useStarFavoriteIcon ? 'text-rose' : 'text-yellow'
              : ''
            "
            :command="command"
            :disabled="isLoading.bookmarked"
            @click="toggleBookmark()"
          />
        </template>

        <CommonDropdownItem
          is="button"
          :text="$t('menu.show_favourited_and_boosted_by')"
          icon="i-ri:hearts-line"
          :command="command"
          @click="showFavoritedAndBoostedBy()"
        />

        <CommonDropdownItem
          is="button"
          :text="$t('menu.copy_link_to_post')"
          icon="i-ri:link"
          :command="command"
          @click="copyLink(status)"
        />

        <CommonDropdownItem
          is="button"
          :text="$t('menu.copy_original_link_to_post')"
          icon="i-ri:links-fill"
          :command="command"
          @click="copyOriginalLink(status)"
        />

        <CommonDropdownItem
          is="button"
          v-if="isShareSupported"
          :text="$t('menu.share_post')"
          icon="i-ri:share-line"
          :command="command"
          @click="shareLink(status)"
        />

        <CommonDropdownItem
          is="button"
          v-if="currentUser && (status.account.id === currentUser.account.id || status.mentions.some(m => m.id === currentUser!.account.id))"
          :text="status.muted ? $t('menu.unmute_conversation') : $t('menu.mute_conversation')"
          :icon="status.muted ? 'i-ri:eye-line' : 'i-ri:eye-off-line'"
          :command="command"
          :disabled="isLoading.muted"
          @click="toggleMute()"
        />

        <NuxtLink v-if="status.url" :to="status.url" external target="_blank">
          <CommonDropdownItem
            :text="$t('menu.open_in_original_site')"
            icon="i-ri:arrow-right-up-line"
            :command="command"
          />
        </NuxtLink>

        <template v-if="isHydrated && currentUser">
          <template v-if="isAuthor">
            <CommonDropdownItem
              is="button"
              :text="status.pinned ? $t('menu.unpin_on_profile') : $t('menu.pin_on_profile')"
              icon="i-ri:pushpin-line"
              :command="command"
              @click="togglePin"
            />

            <CommonDropdownItem
              is="button"
              :text="$t('menu.edit')"
              icon="i-ri:edit-line"
              :command="command"
              @click="editStatus"
            />

            <CommonDropdownItem
              is="button"
              :text="$t('menu.delete')"
              icon="i-ri:delete-bin-line"
              text-red-600
              :command="command"
              @click="deleteStatus"
            />

            <CommonDropdownItem
              is="button"
              :text="$t('menu.delete_and_redraft')"
              icon="i-ri:eraser-line"
              text-red-600
              :command="command"
              @click="deleteAndRedraft"
            />
          </template>
          <template v-else>
            <CommonDropdownItem
              is="button"
              :text="$t('menu.mention_account', [`@${status.account.acct}`])"
              icon="i-ri:at-line"
              :command="command"
              @click="mentionUser(status.account)"
            />

            <CommonDropdownItem
              is="button"
              v-if="!useRelationship(status.account).value?.muting"
              :text="$t('menu.mute_account', [`@${status.account.acct}`])"
              icon="i-ri:volume-mute-line"
              :command="command"
              @click="toggleMuteAccount(useRelationship(status.account).value!, status.account)"
            />
            <CommonDropdownItem
              is="button"
              v-else
              :text="$t('menu.unmute_account', [`@${status.account.acct}`])"
              icon="i-ri:volume-up-fill"
              :command="command"
              @click="toggleMuteAccount(useRelationship(status.account).value!, status.account)"
            />

            <CommonDropdownItem
              is="button"
              v-if="!useRelationship(status.account).value?.blocking"
              :text="$t('menu.block_account', [`@${status.account.acct}`])"
              icon="i-ri:forbid-2-line"
              :command="command"
              @click="toggleBlockAccount(useRelationship(status.account).value!, status.account)"
            />
            <CommonDropdownItem
              is="button"
              v-else
              :text="$t('menu.unblock_account', [`@${status.account.acct}`])"
              icon="i-ri:checkbox-circle-line"
              :command="command"
              @click="toggleBlockAccount(useRelationship(status.account).value!, status.account)"
            />

            <template v-if="getServerName(status.account) && getServerName(status.account) !== currentServer">
              <CommonDropdownItem
                is="button"
                v-if="!useRelationship(status.account).value?.domainBlocking"
                :text="$t('menu.block_domain', [getServerName(status.account)])"
                icon="i-ri:shut-down-line"
                :command="command"
                @click="toggleBlockDomain(useRelationship(status.account).value!, status.account)"
              />
              <CommonDropdownItem
                is="button"
                v-else
                :text="$t('menu.unblock_domain', [getServerName(status.account)])"
                icon="i-ri:restart-line"
                :command="command"
                @click="toggleBlockDomain(useRelationship(status.account).value!, status.account)"
              />
            </template>

            <CommonDropdownItem
              is="button"
              :text="$t('menu.report_account', [`@${status.account.acct}`])"
              icon="i-ri:flag-2-line"
              :command="command"
              @click="openReportDialog(status.account, status)"
            />
          </template>
        </template>
      </div>
    </template>
  </CommonDropdown>
</template>
