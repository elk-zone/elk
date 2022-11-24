<script setup lang="ts">
import type { CreateStatusParams, CreateStatusParamsWithStatus } from 'masto'

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
function getDefaultStatus(): CreateStatusParamsWithStatus {
  return {
    status: '',
    inReplyToId,
  }
}
const draft = $computed(() => {
  if (!currentUserDrafts.value[draftKey]) {
    currentUserDrafts.value[draftKey] = {
      params: getDefaultStatus(),
      attachments: [],
    }
  }
  return currentUserDrafts.value[draftKey]
})

const status = $computed(() => {
  return {
    ...draft.params,
    mediaIds: draft.attachments.map(a => a.id),
  } as CreateStatusParams
})

let isUploading = $ref<boolean>(false)

async function handlePaste(evt: ClipboardEvent) {
  const files = evt.clipboardData?.files
  if (!files)
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

async function publish() {
  try {
    isSending = true
    await masto.statuses.create(status)
    draft.params = getDefaultStatus()
    draft.attachments = []
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
  <div v-if="currentUser" border="t base" p4 flex gap-4>
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

        <div flex-auto />

        <button
          btn-solid rounded-full
          :disabled="isUploading || (draft.attachments.length === 0 && !draft.params.status)"
          @click="publish"
        >
          Publish!
        </button>
      </div>
    </div>
  </div>
</template>
