<script setup lang="ts">
import type { Attachment, CreateStatusParams, CreateStatusParamsWithStatus } from 'masto'

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
  <div
    flex flex-col gap-3
    :class="isSending ? 'pointer-events-none' : ''"
  >
    <textarea
      v-model="draft.params.status"
      :placeholder="placeholder"
      p2 border-rounded w-full h-40
      bg-gray:10 outline-none border="~ base"
      @paste="handlePaste"
    />

    <div flex="~" gap-2>
      <button hover:bg-active p2 rounded-5 @click="pickAttachments">
        <div i-ri:upload-line />
      </button>
    </div>

    <div flex="~ col gap-2" max-h-50vh overflow-auto>
      <publish-attachment
        v-for="(att, idx) in draft.attachments" :key="att.id"
        :attachment="att"
        @remove="removeAttachment(idx)"
      />
    </div>

    <div v-if="isUploading" flex gap-2 justify-end items-center>
      <div op50 i-ri:loader-2-fill animate-spin text-2xl />
      Uploading...
    </div>

    <div flex justify-end>
      <button
        btn-solid
        :disabled="isUploading || (draft.attachments.length === 0 && !draft.params.status)"
        @click="publish"
      >
        Publish!
      </button>
    </div>
  </div>
</template>
