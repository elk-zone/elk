<script setup lang="ts">
import type { Status } from 'masto'

const { status: _status } = defineProps<{
  status: Status
}>()
let status = $ref<Status>({ ..._status })

watch(() => _status, (val) => {
  status = { ...val }
}, { deep: true, immediate: true })

const clipboard = useClipboard()
const router = useRouter()
const route = useRoute()

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

const copyLink = async () => {
  await clipboard.copy(`${location.origin}${getStatusPath(status)}`)
}
const deleteStatus = async () => {
  // TODO confirm to delete
  if (process.dev) {
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

  const { text } = await useMasto().statuses.remove(status.id)

  if (!dialogDraft.isEmpty) {
    // TODO confirm to overwrite
  }

  openPublishDialog({
    params: { ...getParamsFromStatus(status), status: text! },
    attachments: [],
  })
}

function editStatus() {
  if (!dialogDraft.isEmpty) {
    // TODO confirm to overwrite
  }
  openPublishDialog({
    editingStatus: status,
    params: getParamsFromStatus(status),
    attachments: [],
  })
}
</script>

<template>
  <div flex justify-between>
    <CommonTooltip flex-1 placement="bottom" content="Reply">
      <StatusActionButton
        as="router-link"
        :to="getStatusPath(status)"
        :text="status.repliesCount"
        color="text-blue" hover="text-blue" group-hover="bg-blue/10"
        icon="i-ri:chat-3-line"
      />
    </CommonTooltip>

    <CommonTooltip flex-1 placement="bottom" content="Boost">
      <StatusActionButton
        :text="status.reblogsCount"
        color="text-green" hover="text-green" group-hover="bg-green/10"
        icon="i-ri:repeat-line"
        active-icon="i-ri:repeat-fill"
        :active="status.reblogged"
        :disabled="isLoading.reblogged"
        @click="toggleReblog()"
      />
    </CommonTooltip>

    <CommonTooltip flex-1 placement="bottom" content="Favourite">
      <StatusActionButton
        :text="status.favouritesCount"
        color="text-rose" hover="text-rose" group-hover="bg-rose/10"
        icon="i-ri:heart-3-line"
        active-icon="i-ri:heart-3-fill"
        :active="status.favourited"
        :disabled="isLoading.favourited"

        @click="toggleFavourite()"
      />
    </CommonTooltip>

    <CommonTooltip flex-none placement="bottom" content="Bookmark">
      <StatusActionButton
        color="text-yellow" hover="text-yellow" group-hover="bg-yellow/10"
        icon="i-ri:bookmark-line"
        active-icon="i-ri:bookmark-fill"
        :active="status.bookmarked"
        :disabled="isLoading.bookmarked"
        @click="toggleBookmark()"
      />
    </CommonTooltip>

    <CommonDropdown flex-none ml3 placement="bottom">
      <CommonTooltip placement="bottom" content="More">
        <StatusActionButton
          color="text-purple" hover="text-purple" group-hover="bg-purple/10"
          icon="i-ri:more-line"
        />
      </CommonTooltip>

      <template #popper>
        <div flex="~ col">
          <CommonDropdownItem icon="i-ri:link" @click="copyLink">
            Copy link to this post
          </CommonDropdownItem>

          <NuxtLink :to="status.url" target="_blank">
            <CommonDropdownItem v-if="status.url" icon="i-ri:arrow-right-up-line">
              Open in original site
            </CommonDropdownItem>
          </NuxtLink>

          <CommonDropdownItem v-if="isTranslationEnabled && status.language !== languageCode" icon="i-ri:translate" @click="toggleTranslation">
            <template v-if="!translation.visible">
              Translate post
            </template>
            <template v-else>
              Show untranslated
            </template>
          </CommonDropdownItem>

          <template v-if="isAuthor">
            <CommonDropdownItem
              icon="i-ri:pushpin-line"
              @click="togglePin"
            >
              {{ status.pinned ? 'Unpin on profile' : 'Pin on profile' }}
            </CommonDropdownItem>

            <CommonDropdownItem icon="i-ri:edit-line" @click="editStatus">
              Edit
            </CommonDropdownItem>

            <CommonDropdownItem
              icon="i-ri:delete-bin-line" text-red-600
              @click="deleteStatus"
            >
              Delete
            </CommonDropdownItem>

            <CommonDropdownItem
              icon="i-ri:eraser-line" text-red-600
              @click="deleteAndRedraft"
            >
              Delete & re-draft
            </CommonDropdownItem>
          </template>
          <!-- TODO not available when not the same server  -->
          <template v-else>
            <CommonDropdownItem
              icon="i-ri:at-line"
              @click="mentionUser(status.account)"
            >
              Mention @{{ status.account.acct }}
            </CommonDropdownItem>
          </template>
        </div>
      </template>
    </CommonDropdown>
  </div>
</template>
