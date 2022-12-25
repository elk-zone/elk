<script setup lang="ts">
import type { Attachment, CreateStatusParams, StatusVisibility } from 'masto'
import { fileOpen } from 'browser-fs-access'
import { useDropZone } from '@vueuse/core'
import { EditorContent } from '@tiptap/vue-3'
import type { Draft } from '~/types'

const {
  draftKey,
  initial = getDefaultDraft() as never /* Bug of vue-core */,
  expanded: _expanded = false,
  placeholder,
  dialogLabelledBy,
} = defineProps<{
  draftKey: string
  initial?: () => Draft
  placeholder?: string
  inReplyToId?: string
  inReplyToVisibility?: StatusVisibility
  expanded?: boolean
  dialogLabelledBy?: string
}>()

const emit = defineEmits(['published'])

const { t } = useI18n()
// eslint-disable-next-line prefer-const
let { draft, isEmpty } = $(useDraft(draftKey, initial))

let isSending = $ref(false)
let isExpanded = $ref(false)
const shouldExpanded = $computed(() => _expanded || isExpanded || !isEmpty)

const { editor } = useTiptap({
  content: computed({
    get: () => draft.params.status,
    set: newVal => draft.params.status = newVal,
  }),
  placeholder: computed(() => placeholder ?? draft.params.inReplyToId ? t('placeholder.replying') : t('placeholder.default_1')),
  autofocus: shouldExpanded,
  onSubmit: publish,
  onFocus() {
    if (!isExpanded && draft.initialText) {
      editor.value?.chain().insertContent(`${draft.initialText} `).focus('end').run()
      draft.initialText = ''
    }
    isExpanded = true
  },
  onPaste: handlePaste,
})

const currentVisibility = $computed(() => {
  return STATUS_VISIBILITIES.find(v => v.value === draft.params.visibility) || STATUS_VISIBILITIES[0]
})

let isUploading = $ref<boolean>(false)
let failed = $ref<File[]>([])

async function handlePaste(evt: ClipboardEvent) {
  const files = evt.clipboardData?.files
  if (!files || files.length === 0)
    return

  evt.preventDefault()
  await uploadAttachments(Array.from(files))
}

function insertText(text: string) {
  editor.value?.chain().insertContent(text).focus().run()
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

const masto = useMasto()

async function uploadAttachments(files: File[]) {
  isUploading = true
  failed = []
  for (const file of files) {
    try {
      const attachment = await masto.mediaAttachments.create({
        file,
      })
      draft.attachments.push(attachment)
    }
    catch (e) {
      console.error(e)
      failed = [...failed, file]
    }
  }
  isUploading = false
}

async function setDescription(att: Attachment, description: string) {
  att.description = description
  await masto.mediaAttachments.update(att.id, { description: att.description })
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
      await masto.statuses.create(payload)
    else
      await masto.statuses.update(draft.editingStatus.id, payload)

    draft = initial()
    isPublishDialogOpen.value = false
    emit('published')
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

defineExpose({
  focusEditor: () => {
    editor.value?.commands?.focus?.()
  },
})
</script>

<template>
  <div v-if="isMastoInitialised && currentUser" flex="~ col gap-4" py4 px2 sm:px4>
    <template v-if="draft.editingStatus">
      <div flex="~ col gap-1">
        <div id="state-editing" text-secondary self-center>
          {{ $t('state.editing') }}
        </div>
        <StatusCard :status="draft.editingStatus" :actions="false" :hover="false" px-0 />
      </div>
      <div border="b dashed gray/40" />
    </template>

    <div flex gap-4 flex-1>
      <NuxtLink w-12 h-12 :to="getAccountRoute(currentUser.account)">
        <AccountAvatar :account="currentUser.account" f-full h-full />
      </NuxtLink>
      <!-- This `w-0` style is used to avoid overflow problems in flex layouts，so don't remove it unless you know what you're doing -->
      <div
        ref="dropZoneRef"
        flex w-0 flex-col gap-3 flex-1
        border="2 dashed transparent"
        :class="[isSending ? 'pointer-events-none' : '', isOverDropZone ? '!border-primary' : '']"
      >
        <div v-if="draft.params.sensitive">
          <input
            v-model="draft.params.spoilerText"
            type="text"
            :placeholder="$t('placeholder.content_warning')"
            p2 border-rounded w-full bg-transparent
            outline-none border="~ base"
          >
        </div>

        <div relative flex-1 flex flex-col>
          <EditorContent
            :editor="editor"
            flex max-w-full
            :class="shouldExpanded ? 'min-h-30 md:max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-400px)] max-h-35 of-y-auto overscroll-contain' : ''"
          />
          <div v-if="shouldExpanded" absolute right-0 bottom-0 pointer-events-none text-sm text-secondary-light>
            {{ characterLimit - editor?.storage.characterCount.characters() }}
          </div>
        </div>

        <div v-if="isUploading" flex gap-1 items-center text-sm p1 text-primary>
          <div i-ri:loader-2-fill animate-spin />
          {{ $t('state.uploading') }}
        </div>
        <div v-else-if="failed.length > 0" role="alert" aria-describedby="upload-failed" flex="~ col" gap-1 text-sm p1 text-red-600 dark:text-red-400>
          <head id="upload-failed" flex justify-between>
            <div flex items-center gap-x-2 font-bold>
              <div aria-hidden="true" i-ri:error-warning-fill />
              <p>{{ $t('state.upload_failed') }}</p>
            </div>
            <button
              flex rounded-4 p1
              hover:bg-active cursor-pointer transition-100
              :title="$t('action.clear_upload_failed')"
              @click="failed = []"
            >
              <span aria-hidden="true" w-1.75em h-1.75em i-ri:close-line />
            </button>
          </head>
          <ol>
            <li v-for="file in failed" :key="file.name">
              {{ file.name }}
            </li>
          </ol>
        </div>

        <div v-if="draft.attachments.length" flex="~ col gap-2" overflow-auto>
          <PublishAttachment
            v-for="(att, idx) in draft.attachments" :key="att.id"
            :attachment="att"
            :dialog-labelled-by="dialogLabelledBy ?? (draft.editingStatus ? 'state-editing' : null)"
            @remove="removeAttachment(idx)"
            @set-description="setDescription(att, $event)"
          />
        </div>
      </div>
    </div>
    <div flex gap-4>
      <div w-12 h-full sm:block hidden />
      <div
        v-if="shouldExpanded" flex="~ gap-2 1" m="l--1" pt-2 justify="between" max-full
        border="t base"
      >
        <PublishEmojiPicker @select="insertText" />

        <CommonTooltip placement="bottom" :content="$t('tooltip.add_media')">
          <button btn-action-icon :aria-label="$t('tooltip.add_media')" @click="pickAttachments">
            <div i-ri:image-add-line />
          </button>
        </CommonTooltip>

        <template v-if="editor">
          <CommonTooltip placement="bottom" :content="$t('tooltip.toggle_code_block')">
            <button
              btn-action-icon
              :aria-label="$t('tooltip.toggle_code_block')"
              :class="editor.isActive('codeBlock') ? 'op100' : 'op50'"
              @click="editor?.chain().focus().toggleCodeBlock().run()"
            >
              <div i-ri:code-s-slash-line />
            </button>
          </CommonTooltip>
        </template>

        <div flex-auto />

        <CommonTooltip placement="bottom" :content="$t('tooltip.add_content_warning')">
          <button btn-action-icon :aria-label="$t('tooltip.add_content_warning')" @click="toggleSensitive">
            <div v-if="draft.params.sensitive" i-ri:alarm-warning-fill text-orange />
            <div v-else i-ri:alarm-warning-line />
          </button>
        </CommonTooltip>

        <CommonTooltip placement="bottom" :content="$t('tooltip.change_content_visibility')">
          <CommonDropdown>
            <button :aria-label="$t('tooltip.change_content_visibility')" btn-action-icon w-12>
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
                {{ $t(`visibility.${visibility.value}`) }}
                <template #description>
                  {{ $t(`visibility.${visibility.value}_desc`) }}
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
</template>
