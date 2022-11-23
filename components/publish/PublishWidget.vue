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
const storageKey = `elk-draft-${draftKey}`
function getDefaultStatus(): CreateStatusParamsWithStatus {
  return {
    status: '',
    inReplyToId,
  }
}
let draft = $(useLocalStorage<CreateStatusParamsWithStatus>(storageKey, getDefaultStatus()))
let attachments = $(useLocalStorage<Attachment[]>(`${storageKey}-attachments`, []))
const status = $computed(() => {
  return {
    ...draft,
    mediaIds: attachments.map(a => a.id),
  } as CreateStatusParams
})

let isUploading = $ref<boolean>(false)

async function handlePaste(evt: ClipboardEvent) {
  const files = evt.clipboardData?.files
  if (!files)
    return

  await uploadAttachments(Array.from(files))
}

async function pickAttachments() {
  if (!globalThis.showOpenFilePicker)
    // TODO: Safari don't support it.
    return

  const handles = await showOpenFilePicker({
    multiple: true,
    // TODO: add more kinds of files: videos, audios
    types: [{
      description: 'Images',
      accept: {
        'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp', '.avif', '.heic'],
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
    attachments.push(attachment)
  }
  isUploading = false
}

async function removeAttachment(index: number) {
  attachments.splice(index, 1)
}

async function publish() {
  try {
    isSending = true
    await masto.statuses.create(status)
    draft = getDefaultStatus()
    attachments = []
  }
  finally {
    isSending = false
  }
}

onUnmounted(() => {
  if (!draft.status) {
    // @ts-expect-error draft cannot be undefined
    draft = undefined
    nextTick(() => {
      localStorage.removeItem(storageKey)
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
      v-model="draft.status"
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
        v-for="(att, idx) in attachments" :key="att.id"
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
        :disabled="isUploading || (attachments.length === 0 && !draft.status)"
        @click="publish"
      >
        Publish!
      </button>
    </div>
  </div>
</template>
