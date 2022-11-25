<script setup lang="ts">
import type { CreateStatusParams, StatusVisibility } from 'masto'
import { fileOpen } from 'browser-fs-access'
import { useDropZone } from '@vueuse/core'
import { EditorContent } from '@tiptap/vue-3'

const {
  draftKey,
  placeholder = 'What is on your mind?',
  inReplyToId,
  expanded: _expanded = false,
} = defineProps<{
  draftKey: string
  placeholder?: string
  inReplyToId?: string
  expanded?: boolean
}>()

const expanded = $ref(_expanded)
let isSending = $ref(false)
let { draft } = $(useDraft(draftKey, inReplyToId))

const { editor } = useTiptap(toRef(draft.params, 'status'), placeholder)

const status = $computed(() => {
  return {
    ...draft.params,
    mediaIds: draft.attachments.map(a => a.id),
  } as CreateStatusParams
})

const currentVisibility = $computed(() => {
  return STATUS_VISIBILITIES.find(v => v.value === status.visibility) || STATUS_VISIBILITIES[0]
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
  const files = await fileOpen([
    {
      description: 'Attachments',
      multiple: true,
      mimeTypes: ['image/*'],
      extensions: ['.png', '.gif', '.jpeg', '.jpg', '.webp', '.avif', '.heic', '.heif'],
    },
    {
      description: 'Attachments',
      mimeTypes: ['video/*'],
      extensions: ['.webm', '.mp4', '.m4v', '.mov', '.ogv', '.3gp'],
    },
    {
      description: 'Attachments',
      mimeTypes: ['audio/*'],
      extensions: ['.mp3', '.ogg', '.oga', '.wav', '.flac', '.opus', '.aac', '.m4a', '.3gp', '.wma'],
    },
  ])
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
  if (process.dev) {
    alert(JSON.stringify(draft.params, null, 2))
    return
  }
  try {
    isSending = true
    if (!draft.editingStatus)
      await masto.statuses.create(status)
    else
      await masto.statuses.update(draft.editingStatus.id, status)

    draft = getDefaultDraft(inReplyToId)
    isPublishDialogOpen.value = false
  }
  finally {
    isSending = false
  }
}

const dropZoneRef = ref<HTMLDivElement>()

async function onDrop(files: File[] | null) {
  if (files)
    await uploadAttachments(files)
}

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

onUnmounted(() => {
  // Remove draft if it's empty
  if (!draft.attachments.length && !draft.params.status) {
    nextTick(() => {
      delete currentUserDrafts.value[draftKey]
    })
  }
})
</script>

<template>
  <div v-if="currentUser" flex="~ col gap-1">
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
      <NuxtLink w-12 h-12 :to="getAccountPath(currentUser.account)">
        <AccountAvatar :account="currentUser.account" w-12 h-12 />
      </NuxtLink>
      <div
        ref="dropZoneRef"
        flex flex-col gap-3 flex-1
        border="2 dashed transparent"
        :class="[isSending ? 'pointer-events-none' : '', isOverDropZone ? '!border-primary' : '']"
      >
        <EditorContent :editor="editor" />
        <!-- <textarea
          v-model="draft.params.status"
          :placeholder="placeholder"
          h-80px
          :class="expanded ? '!h-200px' : ''"
          p2 border-rounded w-full bg-transparent
          transition="height"
          outline-none border="~ base"
          @paste="handlePaste"
          @focus="expanded = true"
          @keydown.esc="expanded = false"
          @keydown.ctrl.enter="publish"
          @keydown.meta.enter="publish"
        /> -->

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
          <CommonTooltip placement="bottom" content="Add images, a video or an audio file">
            <button btn-action-icon @click="pickAttachments">
              <div i-ri:upload-line />
            </button>
          </CommonTooltip>

          <div flex-auto />

          <CommonDropdown>
            <button btn-action-icon w-12>
              <div :class="currentVisibility.icon" />
              <div i-ri:arrow-down-s-line text-sm op50 mr--1 />
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
          <button
            btn-solid rounded-full text-sm
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
