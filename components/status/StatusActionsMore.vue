<script setup lang="ts">
import type { Status } from 'masto'

const props = defineProps<{
  status: Status
  details?: boolean
  command?: boolean
}>()

const { details, command } = $(props)

const {
  status,
  isLoading,
  toggleBookmark,
  toggleFavourite,
  togglePin,
  toggleReblog,
  toggleMute,
} = $(useStatusActions(props))

const clipboard = useClipboard()
const router = useRouter()
const route = useRoute()

const isAuthor = $computed(() => checkAuth(currentUser.value) && status.account.id === currentUser.value.account.id)

const {
  toggle: _toggleTranslation,
  translation,
  enabled: isTranslationEnabled,
} = useTranslation(props.status)

const toggleTranslation = async () => {
  isLoading.translation = true
  await _toggleTranslation()
  isLoading.translation = false
}

const masto = useMasto()

const getPermalinkUrl = (status: Status) => {
  const url = getStatusPermalinkRoute(status)
  if (url)
    return `${location.origin}/${url}`
  return null
}

const copyLink = async (status: Status) => {
  const url = getPermalinkUrl(status)
  if (url)
    await clipboard.copy(url)
}

const { share, isSupported: isShareSupported } = useShare()
const shareLink = async (status: Status) => {
  const url = getPermalinkUrl(status)
  if (url)
    await share({ url })
}

const deleteStatus = async () => {
  // TODO confirm to delete
  if (process.dev) {
    // eslint-disable-next-line no-alert
    const result = confirm('[DEV] Are you sure you want to delete this post?')
    if (!result)
      return
  }

  removeCachedStatus(status.id)
  await masto.statuses.remove(status.id)

  if (route.name === 'status')
    router.back()

  // TODO when timeline, remove this item
}

const deleteAndRedraft = async () => {
  // TODO confirm to delete
  if (process.dev) {
    // eslint-disable-next-line no-alert
    const result = confirm('[DEV] Are you sure you want to delete and re-draft this post?')
    if (!result)
      return
  }

  removeCachedStatus(status.id)
  await masto.statuses.remove(status.id)
  await openPublishDialog('dialog', await getDraftFromStatus(status), true)

  // Go to the new status, if the page is the old status
  if (lastPublishDialogStatus.value && route.name === 'status')
    router.push(getStatusRoute(lastPublishDialogStatus.value))
}

const reply = () => {
  if (details) {
    // TODO focus to editor
  }
  else {
    const { key, draft } = getReplyDraft(status)
    openPublishDialog(key, draft())
  }
}

async function editStatus() {
  openPublishDialog(`edit-${status.id}`, {
    ...await getDraftFromStatus(status),
    editingStatus: status,
  }, true)
}
</script>

<template>
  <CommonDropdown flex-none ms3 placement="bottom" :eager-mount="command">
    <StatusActionButton
      :content="$t('action.more')"
      color="text-purple"
      hover="text-purple"
      group-hover="bg-purple/10"
      icon="i-ri:more-line"
      my--2
    />

    <template #popper>
      <div flex="~ col">
        <template v-if="userSettings.zenMode">
          <CommonDropdownItem
            :text="$t('action.reply')"
            icon="i-ri:chat-3-line"
            :command="command"
            @click="reply()"
          />

          <CommonDropdownItem
            :text="status.reblogged ? $t('action.boosted') : $t('action.boost')"
            icon="i-ri:repeat-fill"
            :class="status.reblogged ? 'text-green' : ''"
            :command="command"
            :disabled="isLoading.reblogged"
            @click="toggleReblog()"
          />

          <CommonDropdownItem
            :text="status.favourited ? $t('action.favourited') : $t('action.favourite')"
            :icon="status.favourited ? 'i-ri:heart-3-fill' : 'i-ri:heart-3-line'"
            :class="status.favourited ? 'text-rose' : ''"
            :command="command"
            :disabled="isLoading.favourited"
            @click="toggleFavourite()"
          />

          <CommonDropdownItem
            :text="status.bookmarked ? $t('action.bookmarked') : $t('action.bookmark')"
            :icon="status.bookmarked ? 'i-ri:bookmark-fill' : 'i-ri:bookmark-line'"
            :class="status.bookmarked ? 'text-yellow' : ''"
            :command="command"
            :disabled="isLoading.bookmarked"
            @click="toggleBookmark()"
          />
        </template>

        <CommonDropdownItem
          :text="$t('menu.copy_link_to_post')"
          icon="i-ri:link"
          :command="command"
          @click="copyLink(status)"
        />

        <CommonDropdownItem
          v-if="isShareSupported"
          :text="$t('menu.share_post')"
          icon="i-ri:share-line"
          :command="command"
          @click="shareLink(status)"
        />

        <CommonDropdownItem
          v-if="!isGuest && (status.account.id === currentUser!.account!.id || status.mentions.some(m => m.id === currentUser!.account!.id))"
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

        <CommonDropdownItem
          v-if="isTranslationEnabled && status.language !== languageCode"
          :text="translation.visible ? $t('menu.show_untranslated') : $t('menu.translate_post')"
          icon="i-ri:translate"
          :command="command"
          @click="toggleTranslation"
        />

        <template v-if="isMastoInitialised && currentUser">
          <template v-if="isAuthor">
            <CommonDropdownItem
              :text="status.pinned ? $t('menu.unpin_on_profile') : $t('menu.pin_on_profile')"
              icon="i-ri:pushpin-line"
              :command="command"
              @click="togglePin"
            />

            <CommonDropdownItem
              :text="$t('menu.edit')"
              icon="i-ri:edit-line"
              :command="command"
              @click="editStatus"
            />

            <CommonDropdownItem
              :text="$t('menu.delete')"
              icon="i-ri:delete-bin-line"
              text-red-600
              :command="command"
              @click="deleteStatus"
            />

            <CommonDropdownItem
              :text="$t('menu.delete_and_redraft')"
              icon="i-ri:eraser-line"
              text-red-600
              :command="command"
              @click="deleteAndRedraft"
            />
          </template>
          <template v-else>
            <CommonDropdownItem
              :text="$t('menu.mention_account', [`@${status.account.acct}`])"
              icon="i-ri:at-line"
              :command="command"
              @click="mentionUser(status.account)"
            />
          </template>
        </template>
      </div>
    </template>
  </CommonDropdown>
</template>
