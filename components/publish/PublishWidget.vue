<script setup lang="ts">
import type { CreateStatusParams, StatusVisibility } from 'masto'
import { fileOpen } from 'browser-fs-access'
import { useDropZone } from '@vueuse/core'
import { EditorContent } from '@tiptap/vue-3'
import type { Draft } from '~/composables/statusDrafts'

const {
  draftKey,
  initial = getDefaultDraft() as never /* Bug of vue-core */,
  expanded: _expanded = false,
} = defineProps<{
  draftKey: string
  initial?: () => Draft
  placeholder?: string
  inReplyToId?: string
  inReplyToVisibility?: StatusVisibility
  expanded?: boolean
}>()

// eslint-disable-next-line prefer-const
let { draft, isEmpty } = $(useDraft(draftKey, initial))

let isSending = $ref(false)
let isExpanded = $ref(!isEmpty || _expanded)

const { editor } = useTiptap({
  content: computed({
    get: () => draft.params.status,
    set: newVal => draft.params.status = newVal,
  }),
  placeholder: draft.placeholder,
  autofocus: isExpanded,
  onSubmit: publish,
  onFocus() { isExpanded = true },
  onPaste: handlePaste,
})

const currentVisibility = $computed(() => {
  return STATUS_VISIBILITIES.find(v => v.value === draft.params.visibility) || STATUS_VISIBILITIES[0]
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

async function toggleSensitive() {
  draft.params.sensitive = !draft.params.sensitive
}

async function uploadAttachments(files: File[]) {
  isUploading = true
  for (const file of files) {
    const attachment = await useMasto().mediaAttachments.create({
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
  const payload = {
    ...draft.params,
    status: htmlToText(draft.params.status || ''),
    mediaIds: draft.attachments.map(a => a.id),
  } as CreateStatusParams

  if (process.dev) {
    // eslint-disable-next-line no-console
    console.info({
      raw: draft.params.status,
      ...payload,
    })
    // eslint-disable-next-line no-alert
    const result = confirm('[DEV] Payload logged to console, do you want to publish it?')
    if (!result)
      return
  }

  try {
    isSending = true

    if (!draft.editingStatus)
      await useMasto().statuses.create(payload)
    else
      await useMasto().statuses.update(draft.editingStatus.id, payload)

    draft = initial()
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
</script>

<template>
  <div v-if="currentUser" flex="~ col gap-1">
    <template v-if="draft.editingStatus">
      <div flex="~ col gap-1">
        <div text-secondary self-center>
          {{ $t('state.editing') }}
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
        <div v-if="draft.params.sensitive">
          <input
            v-model="draft.params.spoilerText"
            type="text"
            placeholder="Write your warning here"
            p2 border-rounded w-full bg-transparent
            outline-none border="~ base"
          >
        </div>

        <div relative>
          <EditorContent
            :editor="editor"
            flex
            :class="isExpanded ? 'min-h-120px max-h-720px of-y-auto' : ''"
          />
          <div v-if="isExpanded" absolute right-0 bottom-0 pointer-events-none text-sm text-secondary-light>
            {{ characterLimit - editor?.storage.characterCount.characters() }}
          </div>
        </div>

        <div v-if="isUploading" flex gap-1 items-center text-sm p1 text-primary>
          <div i-ri:loader-2-fill animate-spin />
          {{ $t('state.uploading') }}
        </div>

        <div v-if="draft.attachments.length" flex="~ col gap-2" overflow-auto>
          <PublishAttachment
            v-for="(att, idx) in draft.attachments" :key="att.id"
            :attachment="att"
            @remove="removeAttachment(idx)"
          />
        </div>

        <div
          v-if="isExpanded" flex="~ gap-2" m="l--1" pt-2
          border="t base"
        >
          <CommonTooltip placement="bottom" :content="$t('tooltip.add_media')">
            <button btn-action-icon @click="pickAttachments">
              <div i-ri:image-add-line />
            </button>
          </CommonTooltip>

          <template v-if="editor">
            <CommonTooltip placement="bottom" :content="$t('tooltip.toggle_code_block')">
              <button
                btn-action-icon
                :class="editor.isActive('codeBlock') ? 'op100' : 'op50'"
                @click="editor?.chain().focus().toggleCodeBlock().run()"
              >
                <div i-ri:code-s-slash-line />
              </button>
            </CommonTooltip>
          </template>

          <div flex-auto />

          <CommonTooltip placement="bottom" :content="$t('tooltip.add_content_warning')">
            <button btn-action-icon @click="toggleSensitive">
              <div v-if="draft.params.sensitive" i-ri:alarm-warning-fill text-orange />
              <div v-else i-ri:alarm-warning-line />
            </button>
          </CommonTooltip>

          <CommonTooltip placement="bottom" :content="$t('tooltip.change_content_visibility')">
            <CommonDropdown>
              <button btn-action-icon w-12>
                <div :class="currentVisibility.icon" />
                <div i-ri:arrow-down-s-line text-sm text-secondary mr--1 />
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
          </CommonTooltip>

          <button
            btn-solid rounded-full text-sm
            :disabled="isEmpty || isUploading || (draft.attachments.length === 0 && !draft.params.status)"
            @click="publish"
          >
            {{ !draft.editingStatus ? $t('action.publish') : $t('action.save_changes') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
