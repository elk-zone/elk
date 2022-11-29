<script setup lang="ts">
import type { Status } from 'masto'

const { status: _status, details, command } = defineProps<{
  status: Status
  details?: boolean
  command?: boolean
}>()
let status = $ref<Status>({ ..._status })

watch(() => _status, (val) => {
  status = { ...val }
}, { deep: true, immediate: true })

const clipboard = useClipboard()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const isAuthor = $computed(() => status.account.id === currentUser.value?.account.id)

// Use different states to let the user press different actions right after the other
const isLoading = $ref({
  reblogged: false,
  favourited: false,
  bookmarked: false,
  pinned: false,
  translation: false,
})

type Action = 'reblogged' | 'favourited' | 'bookmarked' | 'pinned'
type CountField = 'reblogsCount' | 'favouritesCount'
async function toggleStatusAction(action: Action, newStatus: Promise<Status>, countField?: CountField) {
  // Optimistic update
  status[action] = !status[action]
  if (countField)
    status[countField] += status[action] ? 1 : -1

  try {
    isLoading[action] = true
    Object.assign(status, await newStatus)
  }
  finally {
    isLoading[action] = false
  }
}
const toggleReblog = () => toggleStatusAction(
  'reblogged',
  useMasto().statuses[status.reblogged ? 'unreblog' : 'reblog'](status.id).then((res) => {
    if (status.reblogged)
      // returns the original status
      return res.reblog!
    return res
  }),
  'reblogsCount',
)

const toggleFavourite = () => toggleStatusAction(
  'favourited',
  useMasto().statuses[status.favourited ? 'unfavourite' : 'favourite'](status.id),
  'favouritesCount',
)

const toggleBookmark = () => toggleStatusAction(
  'bookmarked',
  useMasto().statuses[status.bookmarked ? 'unbookmark' : 'bookmark'](status.id),
)
const togglePin = async () => toggleStatusAction(
  'pinned',
  useMasto().statuses[status.pinned ? 'unpin' : 'pin'](status.id),
)

const { toggle: _toggleTranslation, translation, enabled: isTranslationEnabled } = useTranslation(_status)
const toggleTranslation = async () => {
  isLoading.translation = true
  await _toggleTranslation()
  isLoading.translation = false
}

const copyLink = async (url: string) => {
  await clipboard.copy(url)
}
const deleteStatus = async () => {
  // TODO confirm to delete
  if (process.dev) {
    // eslint-disable-next-line no-alert
    const result = confirm('[DEV] Are you sure you want to delete this post?')
    if (!result)
      return
  }

  await useMasto().statuses.remove(status.id)

  if (route.name === '@account-status')
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

  const { text } = await useMasto().statuses.remove(status.id)
  openPublishDialog('dialog', getDraftFromStatus(status, text), true)
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

function editStatus() {
  openPublishDialog(`edit-${status.id}`, {
    ...getDraftFromStatus(status),
    editingStatus: status,
  })
}
</script>

<template>
  <div flex justify-between>
    <div flex-1>
      <StatusActionButton
        :content="t('action.reply')"
        :text="status.repliesCount"
        color="text-blue" hover="text-blue" group-hover="bg-blue/10"
        icon="i-ri:chat-3-line"
        :command="command"
        @click="reply"
      />
    </div>

    <div flex-1>
      <StatusActionButton
        :content="t('action.boost')"
        :text="status.reblogsCount"
        color="text-green" hover="text-green" group-hover="bg-green/10"
        icon="i-ri:repeat-line"
        active-icon="i-ri:repeat-fill"
        :active="status.reblogged"
        :disabled="isLoading.reblogged"
        :command="command"
        @click="toggleReblog()"
      />
    </div>

    <div flex-1>
      <StatusActionButton
        :content="t('action.favourite')"
        :text="status.favouritesCount"
        color="text-rose" hover="text-rose" group-hover="bg-rose/10"
        icon="i-ri:heart-3-line"
        active-icon="i-ri:heart-3-fill"
        :active="status.favourited"
        :disabled="isLoading.favourited"
        :command="command"
        @click="toggleFavourite()"
      />
    </div>

    <div flex-none>
      <StatusActionButton
        :content="t('action.bookmark')"
        color="text-yellow" hover="text-yellow" group-hover="bg-yellow/10"
        icon="i-ri:bookmark-line"
        active-icon="i-ri:bookmark-fill"
        :active="status.bookmarked"
        :disabled="isLoading.bookmarked"
        :command="command"
        @click="toggleBookmark()"
      />
    </div>

    <CommonDropdown flex-none ml3 placement="bottom" :eager-mount="command">
      <StatusActionButton
        :content="t('menu.more')"
        color="text-purple" hover="text-purple" group-hover="bg-purple/10"
        icon="i-ri:more-line"
      />

      <template #popper>
        <div flex="~ col">
          <CommonDropdownItem
            :text="t('action.copy_link_to_this_post')"
            icon="i-ri:link"
            :command="command"
            @click="copyLink(status.url)"
          />

          <NuxtLink :to="status.url" target="_blank">
            <CommonDropdownItem
              v-if="status.url"
              :text="t('menu.open_in_original_site')"
              icon="i-ri:arrow-right-up-line"
              :command="command"
            />
          </NuxtLink>

          <CommonDropdownItem
            v-if="isTranslationEnabled && status.language !== languageCode"
            :text="translation.visible ? t('action.show_untranslated') : t('action.translate_post')"
            icon="i-ri:translate"
            :command="command"
            @click="toggleTranslation"
          />

          <template v-if="currentUser">
            <template v-if="isAuthor">
              <CommonDropdownItem
                :text="status.pinned ? t('action.unpin_on_profile') : t('action.pin_on_profile')"
                icon="i-ri:pushpin-line"
                :command="command"
                @click="togglePin"
              />

              <CommonDropdownItem
                :text="t('action.edit')"
                icon="i-ri:edit-line"
                :command="command"
                @click="editStatus"
              />

              <CommonDropdownItem
                :text="t('action.delete')"
                icon="i-ri:delete-bin-line"
                text-red-600
                :command="command"
                @click="deleteStatus"
              />

              <CommonDropdownItem
                :text="t('action.delete_and_re-draft')"
                icon="i-ri:eraser-line"
                text-red-600
                :command="command"
                @click="deleteAndRedraft"
              />
            </template>
            <template v-else>
              <CommonDropdownItem
                :text="t('action.mention_status_account', [status.account.acct])"
                icon="i-ri:at-line"
                :command="command"
                @click="mentionUser(status.account)"
              />
            </template>
          </template>
        </div>
      </template>
    </CommonDropdown>
  </div>
</template>
