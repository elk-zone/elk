<script setup lang="ts">
import type { Attachment, CreateStatusParams, Status, StatusVisibility } from 'masto'
import { fileOpen } from 'browser-fs-access'
import { useDropZone } from '@vueuse/core'
import { EditorContent } from '@tiptap/vue-3'
import type { Draft } from '~/types'

type FileUploadError = [filename: string, message: string]

const {
  draftKey,
  initial = getDefaultDraft() as never /* Bug of vue-core */,
  expanded: _expanded = false,
  placeholder,
  dialogLabelledBy,
} = defineProps<{
  draftKey?: string
  initial?: () => Draft
  placeholder?: string
  inReplyToId?: string
  inReplyToVisibility?: StatusVisibility
  expanded?: boolean
  dialogLabelledBy?: string
}>()

const emit = defineEmits<{
  (evt: 'published', status: Status): void
}>()

const { t } = useI18n()
// eslint-disable-next-line prefer-const
let { draft, isEmpty } = $(useDraft(draftKey, initial))

let isSending = $ref(false)
let isExpanded = $ref(false)
const shouldExpanded = $computed(() => _expanded || isExpanded || !isEmpty)

const { editor } = useTiptap({
  content: computed({
    get: () => draft.params.status,
    set: (newVal) => {
      draft.params.status = newVal
      draft.lastUpdated = Date.now()
    },
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

let isUploading = $ref<boolean>(false)
let isExceedingAttachmentLimit = $ref<boolean>(false)
let failed = $ref<FileUploadError[]>([])

async function handlePaste(evt: ClipboardEvent) {
  const files = evt.clipboardData?.files
  if (!files || files.length === 0)
    return

  evt.preventDefault()
  await uploadAttachments(Array.from(files))
}

function insertEmoji(name: string) {
  editor.value?.chain().focus().insertEmoji(name).run()
}
function insertCustomEmoji(image: any) {
  editor.value?.chain().focus().insertCustomEmoji(image).run()
}

async function pickAttachments() {
  const mimeTypes = currentInstance.value!.configuration.mediaAttachments.supportedMimeTypes
  const files = await fileOpen({
    description: 'Attachments',
    multiple: true,
    mimeTypes,
  })
  await uploadAttachments(files)
}

async function toggleSensitive() {
  draft.params.sensitive = !draft.params.sensitive
}

const masto = useMasto()

async function uploadAttachments(files: File[]) {
  isUploading = true
  failed = []
  // TODO: display some kind of message if too many media are selected
  // DONE
  const limit = currentInstance.value!.configuration.statuses.maxMediaAttachments || 4
  for (const file of files.slice(0, limit)) {
    if (draft.attachments.length < limit) {
      isExceedingAttachmentLimit = false
      try {
        const attachment = await masto.mediaAttachments.create({
          file,
        })
        draft.attachments.push(attachment)
      }
      catch (e) {
        // TODO: add some human-readable error message, problem is that masto api will not return response code
        console.error(e)
        failed = [...failed, [file.name, (e as Error).message]]
      }
    }
    else {
      isExceedingAttachmentLimit = true
      failed = [...failed, [file.name, t('state.attachments_limit_error')]]
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

async function publish() {
  const payload = {
    ...draft.params,
    status: htmlToText(draft.params.status || ''),
    mediaIds: draft.attachments.map(a => a.id),
    ...(masto.version.includes('+glitch') ? { 'content-type': 'text/markdown' } : {}),
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

    let status: Status
    if (!draft.editingStatus)
      status = await masto.statuses.create(payload)
    else
      status = await masto.statuses.update(draft.editingStatus.id, payload)

    draft = initial()
    emit('published', status)
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
  <div v-if="isMastoInitialised && currentUser" flex="~ col gap-4" py3 px2 sm:px4>
    <template v-if="draft.editingStatus">
      <div flex="~ col gap-1">
        <div id="state-editing" text-secondary self-center>
          {{ $t('state.editing') }}
        </div>
        <StatusCard :status="draft.editingStatus" :actions="false" :hover="false" px-0 />
      </div>
      <div border="b dashed gray/40" />
    </template>

    <div flex gap-3 flex-1>
      <NuxtLink :to="getAccountRoute(currentUser.account)">
        <AccountBigAvatar :account="currentUser.account" />
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
        </div>

        <div v-if="isUploading" flex gap-1 items-center text-sm p1 text-primary>
          <div i-ri:loader-2-fill animate-spin />
          {{ $t('state.uploading') }}
        </div>
        <div
          v-else-if="failed.length > 0"
          role="alert"
          :aria-describedby="isExceedingAttachmentLimit ? 'upload-failed uploads-per-post' : 'upload-failed'"
          flex="~ col"
          gap-1 text-sm
          pt-1 ps-2 pe-1 pb-2
          text-red-600 dark:text-red-400
          border="~ base rounded red-600 dark:red-400"
        >
          <head id="upload-failed" flex justify-between>
            <div flex items-center gap-x-2 font-bold>
              <div aria-hidden="true" i-ri:error-warning-fill />
              <p>{{ $t('state.upload_failed') }}</p>
            </div>
            <CommonTooltip placement="bottom" :content="$t('action.clear_upload_failed')">
              <button
                flex rounded-4 p1
                hover:bg-active cursor-pointer transition-100
                :aria-label="$t('action.clear_upload_failed')"
                @click="failed = []"
              >
                <span aria-hidden="true" w-1.75em h-1.75em i-ri:close-line />
              </button>
            </CommonTooltip>
          </head>
          <div v-if="isExceedingAttachmentLimit" id="uploads-per-post" ps-2 sm:ps-1 text-small>
            {{ $t('state.attachments_exceed_server_limit') }}
          </div>
          <ol ps-2 sm:ps-1>
            <li v-for="error in failed" :key="error[0]" flex="~ col sm:row" gap-y-1 sm:gap-x-2>
              <strong>{{ error[1] }}:</strong>
              <span>{{ error[0] }}</span>
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
        v-if="shouldExpanded" flex="~ gap-1 1 wrap" m="s--1" pt-2 justify="between" max-w-full
        border="t base"
      >
        <PublishEmojiPicker
          @select="insertEmoji"
          @select-custom="insertCustomEmoji"
        >
          <button btn-action-icon :title="$t('tooltip.emoji')">
            <div i-ri:emotion-line />
          </button>
        </PublishEmojiPicker>

        <CommonTooltip placement="top" :content="$t('tooltip.add_media')">
          <button btn-action-icon :aria-label="$t('tooltip.add_media')" @click="pickAttachments">
            <div i-ri:image-add-line />
          </button>
        </CommonTooltip>

        <template v-if="editor">
          <CommonTooltip placement="top" :content="$t('tooltip.toggle_code_block')">
            <button
              btn-action-icon
              :aria-label="$t('tooltip.toggle_code_block')"
              :class="editor.isActive('codeBlock') ? 'text-primary' : ''"
              @click="editor?.chain().focus().toggleCodeBlock().run()"
            >
              <div i-ri:code-s-slash-line />
            </button>
          </CommonTooltip>
        </template>

        <div flex-auto />

        <div dir="ltr" pointer-events-none pe-1 pt-2 text-sm tabular-nums text-secondary flex gap-0.5>
          {{ editor?.storage.characterCount.characters() }}<span text-secondary-light>/</span><span text-secondary-light>{{ characterLimit }}</span>
        </div>

        <CommonTooltip placement="top" :content="$t('tooltip.add_content_warning')">
          <button btn-action-icon :aria-label="$t('tooltip.add_content_warning')" @click="toggleSensitive">
            <div v-if="draft.params.sensitive" i-ri:alarm-warning-fill text-orange />
            <div v-else i-ri:alarm-warning-line />
          </button>
        </CommonTooltip>

        <CommonTooltip placement="top" :content="$t('tooltip.change_language')">
          <CommonDropdown placement="bottom" auto-boundary-max-size>
            <button btn-action-icon :aria-label="$t('tooltip.change_language')" w-12 mr--1>
              <div i-ri:translate-2 />
              <div i-ri:arrow-down-s-line text-sm text-secondary me--1 />
            </button>

            <template #popper>
              <PublishLanguagePicker v-model="draft.params.language" min-w-80 p3 />
            </template>
          </CommonDropdown>
        </CommonTooltip>

        <PublishVisibilityPicker v-model="draft.params.visibility" :editing="!!draft.editingStatus">
          <template #default="{ visibility }">
            <button :disabled="!!draft.editingStatus" :aria-label="$t('tooltip.change_content_visibility')" btn-action-icon :class="{ 'w-12': !draft.editingStatus }">
              <div :class="visibility.icon" />
              <div v-if="!draft.editingStatus" i-ri:arrow-down-s-line text-sm text-secondary me--1 />
            </button>
          </template>
        </PublishVisibilityPicker>

        <button
          btn-solid rounded-3 text-sm w-full md:w-fit
          :disabled="isEmpty || isUploading || (draft.attachments.length === 0 && !draft.params.status)"
          @click="publish"
        >
          {{ !draft.editingStatus ? $t('action.publish') : $t('action.save_changes') }}
        </button>
      </div>
    </div>
  </div>
</template>
