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
})
async function toggleStatusAction(action: 'reblogged' | 'favourited' | 'bookmarked' | 'pinned', newStatus: Promise<Status>) {
  // Optimistic update
  status[action] = !status[action]
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
  masto.statuses[status.reblogged ? 'unreblog' : 'reblog'](status.id).then((res) => {
    if (status.reblogged)
      // returns the original status
      return res.reblog!
    return res
  }),
)

const toggleFavourite = () => toggleStatusAction(
  'favourited',
  masto.statuses[status.favourited ? 'unfavourite' : 'favourite'](status.id),
)

const toggleBookmark = () => toggleStatusAction(
  'bookmarked',
  masto.statuses[status.bookmarked ? 'unbookmark' : 'bookmark'](status.id),
)
const togglePin = async () => toggleStatusAction(
  'pinned',
  masto.statuses[status.pinned ? 'unpin' : 'pin'](status.id),
)

const copyLink = async () => {
  await clipboard.copy(`${location.origin}${getStatusPath(status)}`)
}
const openInOriginal = () => {
  window.open(status.url!, '_blank')
}
const deleteStatus = async () => {
  // TODO confirm to delete

  await masto.statuses.remove(status.id)
  if (route.name === '@user-post')
    router.back()

  // TODO when timeline, remove this item
}

const deleteAndRedraft = async () => {
  // TODO confirm to delete

  const { text } = await masto.statuses.remove(status.id)

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

function mention() {
  openPublishDialog({
    params: {
      ...getParamsFromStatus(status),
      status: `@${status.account.acct} `,
    },
    attachments: [],
  })
}
</script>

<template>
  <div flex justify-between gap-8>
    <CommonTooltip placement="bottom" content="Replay">
      <RouterLink :to="getStatusPath(status)">
        <StatusActionButton
          :text="status.repliesCount"
          color="text-blue" hover="text-blue" group-hover="bg-blue/10"
          icon="i-ri:chat-3-line"
        />
      </RouterLink>
    </CommonTooltip>

    <CommonTooltip placement="bottom" content="Boost">
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

    <CommonTooltip placement="bottom" content="Favourite">
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

    <CommonTooltip placement="bottom" content="Bookmark">
      <StatusActionButton
        color="text-yellow" hover="text-yellow" group-hover="bg-yellow/10"
        icon="i-ri:bookmark-line"
        active-icon="i-ri:bookmark-fill"
        :active="status.bookmarked"
        :disabled="isLoading.bookmarked"
        @click="toggleBookmark()"
      />
    </CommonTooltip>

    <CommonDropdown placement="bottom">
      <CommonTooltip placement="bottom" content="More">
        <button flex gap-1 items-center rounded op50 hover="op100 text-purple" group>
          <div rounded-full p2 group-hover="bg-purple/10">
            <div i-ri:more-line />
          </div>
        </button>
      </CommonTooltip>

      <template #popper>
        <div flex="~ col">
          <CommonDropdownItem icon="i-ri:link" @click="copyLink">
            Copy link to this post
          </CommonDropdownItem>

          <CommonDropdownItem v-if="status.url" icon="i-ri:arrow-right-up-line" @click="openInOriginal">
            Open in original site
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
              @click="mention"
            >
              Mention @{{ status.account.acct }}
            </CommonDropdownItem>
          </template>
        </div>
      </template>
    </CommonDropdown>
  </div>
</template>
