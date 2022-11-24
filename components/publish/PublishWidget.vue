<script setup lang="ts">
import type { CreateStatusParams, StatusVisibility } from 'masto'

const {
  draftKey,
  placeholder = 'What is on your mind?',
  inReplyToId,
} = defineProps<{
  draftKey: string
  placeholder?: string
  inReplyToId?: string
}>()

let isSending = $ref(false)
let { draft } = $(useDraft(draftKey, inReplyToId))

const status = $computed(() => {
  return {
    ...draft.params,
    mediaIds: draft.attachments.map(a => a.id),
  } as CreateStatusParams
})

const currentVisibility = $computed(() => {
  return STATUS_VISIBILITIES.find(v => v.value === status.visibility)!
})

let isUploading = $ref<boolean>(false)

async function handlePaste(evt: ClipboardEvent) {
  const files = evt.clipboardData?.files
  if (!files || files.length === 0)
    return

  evt.preventDefault()
  await uploadAttachments(Array.from(files))
}

async function pickAttachments() {
  if (!globalThis.showOpenFilePicker)
    // TODO: FireFox & Safari don't support it.
    return

  const handles = await showOpenFilePicker({
    multiple: true,
    types: [{
      description: 'Attachments',
      accept: {
        'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp', '.avif', '.heic', '.heif'],
        'video/*': ['.webm', '.mp4', '.m4v', '.mov', '.ogv', '.3gp'],
        'audio/*': ['.mp3', '.ogg', '.oga', '.wav', '.flac', '.opus', '.aac', '.m4a', '.3gp', '.wma'],
      },
    }],
  })
  const files = await Promise.all(handles.map(handle => handle.getFile()))
  await uploadAttachments(files)
}

async function uploadAttachments(files: File[]) {
  isUploading = true
  for (const file of files) {
    const attachment = await masto.mediaAttachments.create({
      file,
    })
    draft.attachments.push(attachment)
  }
  isUploading = false
}

function removeAttachment(index: number) {
  draft.attachments.splice(index, 1)
}

function chooseVisibility(visibility: StatusVisibility) {
  draft.params.visibility = visibility
}

async function publish() {
  try {
    isSending = true
    if (!draft.editingStatus)
      await masto.statuses.create(status)
    else await masto.statuses.update(draft.editingStatus.id, status)

    draft = {
      params: getDefaultStatus(inReplyToId),
      attachments: [],
    }
    isPublishDialogOpen.value = false
  }
  finally {
    isSending = false
  }
}

onUnmounted(() => {
  if (!draft.attachments.length && !draft.params.status) {
    nextTick(() => {
      delete currentUserDrafts.value[draftKey]
    })
  }
})
</script>

<template>
  <div v-if="currentUser" flex="~ col">
    <template v-if="draft.editingStatus">
      <div flex="~ col gap-1">
        <div text-gray self-center>
          Editing
        </div>
        <StatusCard :status="draft.editingStatus" :actions="false" :hover="false" />
      </div>
      <div border="b dashed gray/40" />
    </template>
    <div p4 flex gap-4>
      <AccountAvatar :account="currentUser.account" w-12 h-12 />
      <div
        flex flex-col gap-3 flex-auto
        :class="isSending ? 'pointer-events-none' : ''"
      >
        <textarea
          v-model="draft.params.status"
          :placeholder="placeholder"
          p2 border-rounded w-full bg-transparent
          outline-none border="~ base"
          @paste="handlePaste"
        />

        <div flex="~ col gap-2" max-h-50vh overflow-auto>
          <PublishAttachment
            v-for="(att, idx) in draft.attachments" :key="att.id"
            :attachment="att"
            @remove="removeAttachment(idx)"
          />
        </div>

        <div v-if="isUploading" flex gap-2 justify-end items-center>
          <div op50 i-ri:loader-2-fill animate-spin text-2xl />
          Uploading...
        </div>

        <div flex="~ gap-2">
          <button btn-action-icon @click="pickAttachments">
            <div i-ri:upload-line />
          </button>

          <CommonDropdown>
            <button btn-action-icon>
              <div :class="currentVisibility.icon" />
            </button>

            <template #popper>
              <CommonDropdownItem
                v-for="visibility in STATUS_VISIBILITIES"
                :key="visibility.value"
                :icon="visibility.icon"
                :checked="visibility.value === draft.params.visibility"
                @click="chooseVisibility(visibility.value)"
              >
                {{ visibility.label }}
                <template #description>
                  {{ visibility.description }}
                </template>
              </CommonDropdownItem>
            </template>
          </CommonDropdown>

          <div flex-auto />

          <button
            btn-solid rounded-full
            :disabled="isUploading || (draft.attachments.length === 0 && !draft.params.status)"
            @click="publish"
          >
            {{ !draft.editingStatus ? 'Publish!' : 'Save changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
