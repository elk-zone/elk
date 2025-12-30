<script setup lang="ts">
import type { DraftItem, DraftKey } from '#shared/types'
import type { mastodon } from 'masto'
import { EditorContent } from '@tiptap/vue-3'
import { useNow } from '@vueuse/core'
import stringLength from 'string-length'

const {
  threadComposer,
  draftKey,
  draftItemIndex,
  expanded = false,
  placeholder,
  initial = getDefaultDraftItem,
} = defineProps<{
  draftKey: DraftKey
  draftItemIndex: number
  initial?: () => DraftItem
  threadComposer?: ReturnType<typeof useThreadComposer>
  placeholder?: string
  inReplyToId?: string
  inReplyToVisibility?: mastodon.v1.StatusVisibility
  expanded?: boolean
  dialogLabelledBy?: string
}>()

const emit = defineEmits<{
  (evt: 'published', status: mastodon.v1.Status): void
}>()

const { t } = useI18n()

const { threadItems, threadIsActive, publishThread, threadIsSending } = threadComposer ?? useThreadComposer(draftKey)

const draft = computed({
  get: () => threadItems.value[draftItemIndex],
  set: (updatedDraft: DraftItem) => {
    threadItems.value[draftItemIndex] = updatedDraft
  },
},
)

const isFinalItemOfThread = computed(() => draftItemIndex === threadItems.value.length - 1)

const {
  isExceedingAttachmentLimit,
  isUploading,
  failedAttachments,
  isOverDropZone,
  uploadAttachments,
  pickAttachments,
  setDescription,
  removeAttachment,
  dropZoneRef,
} = useUploadMediaAttachment(draft)

const {
  shouldExpanded,
  isExpanded,
  isSending,
  isPublishDisabled,
  publishDraft,
  failedMessages,
  preferredLanguage,
  publishSpoilerText,
} = usePublish(
  {
    draftItem: draft,
    ...{ expanded: toRef(() => expanded), isUploading, initialDraft: initial, isPartOfThread: false },
  },
)

const { editor } = useTiptap({
  content: computed({
    get: () => draft.value.params.status,
    set: (newVal) => {
      draft.value.params.status = newVal
      draft.value.lastUpdated = Date.now()
    },
  }),
  placeholder: computed(() => placeholder ?? draft.value.params.inReplyToId ? t('placeholder.replying') : t('placeholder.default_1')),
  autofocus: shouldExpanded.value,
  onSubmit: publish,
  onFocus() {
    if (!isExpanded && draft.value.initialText) {
      editor.value?.chain().insertContent(`${draft.value.initialText} `).focus('end').run()
      draft.value.initialText = ''
    }
    isExpanded.value = true
  },
  onPaste: handlePaste,
})

function trimPollOptions() {
  const indexLastNonEmpty = draft.value.params.poll!.options.findLastIndex(option => option.trim().length > 0)
  const trimmedOptions = draft.value.params.poll!.options.slice(0, indexLastNonEmpty + 1)

  if (currentInstance.value?.configuration
    && trimmedOptions.length >= currentInstance.value?.configuration?.polls.maxOptions) {
    draft.value.params.poll!.options = trimmedOptions
  }
  else {
    draft.value.params.poll!.options = [...trimmedOptions, '']
  }
}

function editPollOptionDraft(event: Event, index: number) {
  draft.value.params.poll!.options = Object.assign(draft.value.params.poll!.options.slice(), { [index]: (event.target as HTMLInputElement).value })

  trimPollOptions()
}

function deletePollOption(index: number) {
  const newPollOptions = draft.value.params.poll!.options.slice()
  newPollOptions.splice(index, 1)
  draft.value.params.poll!.options = newPollOptions
  trimPollOptions()
}

const expiresInOptions = computed(() => [
  {
    seconds: 1 * 60 * 60,
    label: t('time_ago_options.hour_future', 1),
  },
  {
    seconds: 2 * 60 * 60,
    label: t('time_ago_options.hour_future', 2),
  },
  {
    seconds: 1 * 24 * 60 * 60,
    label: t('time_ago_options.day_future', 1),
  },
  {
    seconds: 2 * 24 * 60 * 60,
    label: t('time_ago_options.day_future', 2),
  },
  {
    seconds: 7 * 24 * 60 * 60,
    label: t('time_ago_options.day_future', 7),
  },
])

const expiresInDefaultOptionIndex = 2

const scheduledTime = ref('')
const now = useNow({ interval: 1000 })
const minimumScheduledTime = computed(() => getMinimumScheduledTime(now.value))

const isValidScheduledTime = computed(() => {
  if (scheduledTime.value === '')
    return true

  const scheduledTimeDate = new Date(scheduledTime.value)
  return minimumScheduledTime.value.getTime() <= scheduledTimeDate.getTime()
})

const initialDateTime = computed(() => {
  const t = new Date(minimumScheduledTime.value.getTime())
  t.setHours(t.getHours() + 1)
  t.setMinutes(0)
  t.setSeconds(0)
  t.setMilliseconds(0)
  return t
})

watchEffect(() => {
  // Convert the local datetime string from the input to a UTC ISO string for the API
  if (scheduledTime.value) {
    const localDate = new Date(scheduledTime.value)
    draft.value.params.scheduledAt = localDate.toISOString()
  }
  else {
    draft.value.params.scheduledAt = ''
  }
})

function setInitialScheduledTime() {
  if (scheduledTime.value === '') {
    scheduledTime.value = getDatetimeInputFormat(initialDateTime.value)
  }
}

watchEffect(() => {
  draft.value.params.scheduledAt = scheduledTime.value
})

// Calculate the minimum scheduled time.
// Mastodon API allows to set the scheduled time to 5 minutes in the future
// but if the specified scheduled time is less than 5 minutes, Mastodon will
// send the post immediately.
// To prevent this, we add a buffer and round up the minutes.
function getMinimumScheduledTime(now: Date): Date {
  const bufferInSec = 5 + 5 * 60 // + 5 minutes and 5 seconds
  const nowInSec = Math.floor(now.getTime() / 1000)
  const bufferedTimeInSec
    = Math.ceil((nowInSec + bufferInSec) / 60) * 60
  return new Date(bufferedTimeInSec * 1000)
}

function getDatetimeInputFormat(time: Date) {
  // Returns string in 'YYYY-MM-DDTHH:MM' format using local time components
  // This is the format expected by the <input type="datetime-local"> element.
  const year = time.getFullYear()
  const month = (time.getMonth() + 1).toString().padStart(2, '0')
  const day = time.getDate().toString().padStart(2, '0')
  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const characterCount = computed(() => {
  const text = htmlToText(editor.value?.getHTML() || '')

  let length = stringLength(text)

  // taken from https://github.com/mastodon/mastodon/blob/07f8b4d1b19f734d04e69daeb4c3421ef9767aac/app/lib/text_formatter.rb
  const linkRegex = /(https?:\/\/|xmpp:)\S+/g

  // taken from https://github.com/mastodon/mastodon/blob/af578e/app/javascript/mastodon/features/compose/util/counter.js
  const countableMentionRegex = /(^|[^/\w])@((\w+)@[a-z0-9.-]+[a-z0-9])/gi

  // maximum of 23 chars per link
  // https://github.com/elk-zone/elk/issues/1651
  const maxLength = 23

  for (const [fullMatch] of text.matchAll(linkRegex))
    length -= fullMatch.length - Math.min(maxLength, fullMatch.length)

  for (const [fullMatch, before, _handle, username] of text.matchAll(countableMentionRegex))
    length -= fullMatch.length - (before + username).length - 1 // - 1 for the @

  if (draft.value.mentions) {
    // + 1 is needed as mentions always need a space separator at the end
    length += draft.value.mentions.map((mention) => {
      const [handle] = mention.split('@')
      return `@${handle}`
    }).join(' ').length + 1
  }

  length += stringLength(publishSpoilerText.value)

  return length
})

const isExceedingCharacterLimit = computed(() => {
  return characterCount.value > characterLimit.value
})

const postLanguageDisplay = computed(() => languagesNameList.find(i => i.code === (draft.value.params.language || preferredLanguage.value))?.nativeName)

const isDM = computed(() => draft.value.params.visibility === 'direct')

const hasQuote = computed(() => !!draft.value.params.quotedStatusId)
const quotedStatus = ref<mastodon.v1.Status | null>(null)
const quoteFetchError = ref<string | null>(null)
watchEffect(async () => {
  if (hasQuote.value) {
    try {
      quotedStatus.value = await fetchStatus(draft.value.params.quotedStatusId!)
    }
    catch (err) {
      console.error(err)
      quoteFetchError.value = (err as Error).message
    }
  }
})

function removeQuote() {
  draft.value.params.quotedStatusId = undefined
  draft.value.params.quoteApprovalPolicy = undefined
  quotedStatus.value = null
  quoteFetchError.value = null
}

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

async function toggleSensitive() {
  draft.value.params.sensitive = !draft.value.params.sensitive
}

async function publish() {
  if (isPublishDisabled.value || isExceedingCharacterLimit.value)
    return

  const publishResult = await (threadIsActive.value ? publishThread() : publishDraft())
  if (publishResult) {
    if (Array.isArray(publishResult))
      failedMessages.value = publishResult
    else
      emit('published', publishResult)
  }
}

useWebShareTarget(async ({ data: { data, action } }: any) => {
  if (action !== 'compose-with-shared-data')
    return

  editor.value?.commands.focus('end')

  for (const text of data.textParts) {
    for (const line of text.split('\n')) {
      editor.value?.commands.insertContent({
        type: 'paragraph',
        content: [{ type: 'text', text: line }],
      })
    }
  }

  if (data.files.length !== 0)
    await uploadAttachments(data.files)
})

defineExpose({
  focusEditor: () => {
    editor.value?.commands?.focus?.()
  },
})

function stopQuestionMarkPropagation(e: KeyboardEvent) {
  if (e.key === '?')
    e.stopImmediatePropagation()
}

const userSettings = useUserSettings()

const optimizeForLowPerformanceDevice = computed(() => getPreferences(userSettings.value, 'optimizeForLowPerformanceDevice'))

const languageDetectorInGlobalThis = 'LanguageDetector' in globalThis
let supportsLanguageDetector = !optimizeForLowPerformanceDevice.value && languageDetectorInGlobalThis && await (globalThis as any).LanguageDetector.availability() === 'available'
let languageDetector: { detect: (arg0: string, option: { signal: AbortSignal }) => any }
// If the API is supported, but the model not loaded yet…
if (languageDetectorInGlobalThis && !supportsLanguageDetector) {
  // …trigger the model download
  (globalThis as any).LanguageDetector.create().then((_languageDetector: { detect: (arg0: string) => any }) => {
    supportsLanguageDetector = true
    languageDetector = _languageDetector
  })
}

function countLetters(text: string) {
  const segmenter = new Intl.Segmenter('und', { granularity: 'grapheme' })
  const letters = [...segmenter.segment(text)]
  return letters.length
}

let detectLanguageAbortController = new AbortController()

const detectLanguage = useDebounceFn(async () => {
  if (!supportsLanguageDetector) {
    return
  }
  if (!languageDetector) {
    // maybe we dont want to mess with this with abort....
    languageDetector = await (globalThis as any).LanguageDetector.create()
  }
  // we stop previously running language detection process
  detectLanguageAbortController.abort()
  detectLanguageAbortController = new AbortController()
  const text = htmlToText(editor.value?.getHTML() || '')
  if (!text || countLetters(text) <= 5) {
    draft.value.params.language = preferredLanguage.value
    return
  }
  try {
    const detectedLanguage = (await languageDetector.detect(text, { signal: detectLanguageAbortController.signal }))[0].detectedLanguage
    draft.value.params.language = detectedLanguage === 'und' ? preferredLanguage.value : detectedLanguage.substring(0, 2)
  }
  catch (e) {
    // if error or abort we end up there
    if ((e as Error).name !== 'AbortError') {
      console.error(e)
    }
    draft.value.params.language = preferredLanguage.value
  }
}, 500)
</script>

<template>
  <div v-if="isHydrated && currentUser" flex="~ col gap-4" py3 px2 sm:px4 aria-roledescription="publish-widget">
    <template v-if="draft.editingStatus">
      <div id="state-editing" text-secondary self-center>
        {{ $t('state.editing') }}
      </div>
    </template>
    <div flex gap-3 flex-1>
      <div>
        <NuxtLink self-start :to="getAccountRoute(currentUser.account)">
          <AccountBigAvatar :account="currentUser.account" square />
        </NuxtLink>
        <div v-if="!isFinalItemOfThread" w-full h-full flex mt--3px justify-center>
          <div w-1px border="x base" mb-6 />
        </div>
      </div>

      <div w-full>
        <div flex gap-3 flex-1>
          <!-- This `w-0` style is used to avoid overflow problems in flex layouts，so don't remove it unless you know what you're doing -->
          <div
            ref="dropZoneRef" flex w-0 flex-col gap-3 flex-1 border="2 dashed transparent"
            :class="[isSending ? 'pointer-events-none' : '', isOverDropZone ? '!border-primary' : '']"
          >
            <ContentMentionGroup v-if="draft.mentions?.length && shouldExpanded" replying>
              <button
                v-for="m, i of draft.mentions" :key="m" text-primary hover:color-red
                @click="draft.mentions?.splice(i, 1)"
              >
                {{ accountToShortHandle(m) }}
              </button>
            </ContentMentionGroup>

            <div v-if="draft.params.sensitive">
              <input
                v-model="publishSpoilerText" type="text" :placeholder="$t('placeholder.content_warning')" p2
                border-rounded w-full bg-transparent outline-none border="~ base"
              >
            </div>

            <CommonErrorMessage v-if="failedMessages.length > 0" described-by="publish-failed">
              <header id="publish-failed" flex justify-between>
                <div flex items-center gap-x-2 font-bold>
                  <div aria-hidden="true" i-ri:error-warning-fill />
                  <p>{{ $t('state.publish_failed') }}</p>
                </div>
                <CommonTooltip placement="bottom" :content="$t('action.clear_publish_failed')">
                  <button
                    flex rounded-4 p1 hover:bg-active cursor-pointer transition-100
                    :aria-label="$t('action.clear_publish_failed')" @click="failedMessages = []"
                  >
                    <span aria-hidden="true" w="1.75em" h="1.75em" i-ri:close-line />
                  </button>
                </CommonTooltip>
              </header>
              <ol ps-2 sm:ps-1>
                <li v-for="(error, i) in failedMessages" :key="i" flex="~ col sm:row" gap-y-1 sm:gap-x-2>
                  <strong>{{ i + 1 }}.</strong>
                  <span>{{ error }}</span>
                </li>
              </ol>
            </CommonErrorMessage>
            <CommonErrorMessage v-if="failedMessages.length > 0" described-by="publish-failed">
              <header id="publish-failed" flex justify-between>
                <div flex items-center gap-x-2 font-bold>
                  <div aria-hidden="true" i-ri:error-warning-fill />
                  <p>{{ scheduledTime ? $t('state.schedule_failed') : $t('state.publish_failed') }}</p>
                </div>
                <CommonTooltip
                  placement="bottom"
                  :content="scheduledTime ? $t('action.clear_schedule_failed') : $t('action.clear_publish_failed')"
                >
                  <button
                    flex rounded-4 p1 hover:bg-active cursor-pointer transition-100
                    :aria-label="scheduledTime ? $t('action.clear_schedule_failed') : $t('action.clear_publish_failed')"
                    @click="failedMessages = []"
                  >
                    <span aria-hidden="true" w="1.75em" h="1.75em" i-ri:close-line />
                  </button>
                </CommonTooltip>
              </header>
              <ol ps-2 sm:ps-1>
                <li v-for="(error, i) in failedMessages" :key="i" flex="~ col sm:row" gap-y-1 sm:gap-x-2>
                  <strong>{{ i + 1 }}.</strong>
                  <span>{{ error }}</span>
                </li>
              </ol>
            </CommonErrorMessage>

            <CommonErrorMessage v-if="!isValidScheduledTime" described-by="scheduled-time-invalid" pt-2>
              <header id="scheduled-time-invalid" flex justify-between>
                <div flex items-center gap-x-2 font-bold>
                  <div aria-hidden="true" i-ri:error-warning-fill />
                  <p>{{ $t('state.schedule_time_invalid', [minimumScheduledTime.toLocaleString()]) }}</p>
                </div>
              </header>
            </CommonErrorMessage>

            <div relative flex-1 flex flex-col :class="shouldExpanded ? 'min-h-30' : ''">
              <EditorContent
                :editor="editor" flex max-w-full
                :class="{
                  'md:max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-400px)] max-h-35 of-y-auto overscroll-contain': shouldExpanded,
                  'py2 px3.5 bg-dm rounded-4 me--1 ms--1 mt--1': isDM,
                }"
                @keydown="stopQuestionMarkPropagation"
                @keydown.esc.prevent="editor?.commands.blur()"
                @keyup="detectLanguage"
              />
            </div>

            <div v-if="isUploading" flex gap-1 items-center text-sm p1 text-primary>
              <div animate-spin preserve-3d>
                <div i-ri:loader-2-fill />
              </div>
              {{ $t('state.uploading') }}
            </div>
            <CommonErrorMessage
              v-else-if="failedAttachments.length > 0"
              :described-by="isExceedingAttachmentLimit ? 'upload-failed uploads-per-post' : 'upload-failed'"
            >
              <header id="upload-failed" flex justify-between>
                <div flex items-center gap-x-2 font-bold>
                  <div aria-hidden="true" i-ri:error-warning-fill />
                  <p>{{ $t('state.upload_failed') }}</p>
                </div>
                <CommonTooltip placement="bottom" :content="$t('action.clear_upload_failed')">
                  <button
                    flex rounded-4 p1 hover:bg-active cursor-pointer transition-100
                    :aria-label="$t('action.clear_upload_failed')" @click="failedAttachments = []"
                  >
                    <span aria-hidden="true" w="1.75em" h="1.75em" i-ri:close-line />
                  </button>
                </CommonTooltip>
              </header>
              <div v-if="isExceedingAttachmentLimit" id="uploads-per-post" ps-2 sm:ps-1 text-small>
                {{ $t('state.attachments_exceed_server_limit') }}
              </div>
              <ol ps-2 sm:ps-1>
                <li v-for="error in failedAttachments" :key="error[0]" flex="~ col sm:row" gap-y-1 sm:gap-x-2>
                  <strong>{{ error[1] }}:</strong>
                  <span>{{ error[0] }}</span>
                </li>
              </ol>
            </CommonErrorMessage>

            <div v-if="draft.attachments.length" flex="~ col gap-2" overflow-auto>
              <PublishAttachment
                v-for="(att, idx) in draft.attachments" :key="att.id" :attachment="att"
                :dialog-labelled-by="dialogLabelledBy ?? (draft.editingStatus ? 'state-editing' : undefined)"
                @remove="removeAttachment(idx)" @set-description="setDescription(att, $event)"
              />
            </div>
          </div>
        </div>

        <div flex="~ col 1" max-w-full>
          <form v-if="isExpanded && draft.params.poll" my-4 flex="~ 1 col" gap-3 m="s--1">
            <div v-for="(option, index) in draft.params.poll.options" :key="index" flex="~ row" gap-3>
              <input
                :value="option" bg-base border="~ base" flex-1 h10 pe-4 rounded-2 w-full flex="~ row" items-center
                relative focus-within:box-shadow-outline gap-3 px-4 py-2
                :placeholder="$t('polls.option_placeholder', { current: index + 1, max: currentInstance?.configuration?.polls.maxOptions })"
                class="option-input" @input="editPollOptionDraft($event, index)"
              >
              <CommonTooltip placement="top" :content="$t('polls.remove_option')" class="delete-button">
                <button
                  btn-action-icon class="hover:bg-red/75"
                  :disabled="index === draft.params.poll!.options.length - 1 && (index + 1 !== currentInstance?.configuration?.polls.maxOptions || draft.params.poll!.options[index].length === 0)"
                  @click.prevent="deletePollOption(index)"
                >
                  <div i-ri:delete-bin-line />
                </button>
              </CommonTooltip>
              <span
                v-if="currentInstance?.configuration?.polls.maxCharactersPerOption" class="char-limit-radial"
                aspect-ratio-1 h-10
                :style="{ background: `radial-gradient(closest-side, rgba(var(--rgb-bg-base)) 79%, transparent 80% 100%), conic-gradient(${draft.params.poll!.options[index].length / currentInstance?.configuration?.polls.maxCharactersPerOption > 1 ? 'var(--c-danger)' : 'var(--c-primary)'} ${draft.params.poll!.options[index].length / currentInstance?.configuration?.polls.maxCharactersPerOption * 100}%, var(--c-primary-fade) 0)` }"
              >{{
                draft.params.poll!.options[index].length
              }}</span>
            </div>
          </form>

          <template v-if="hasQuote">
            <div flex justify-end mt-2>
              <button
                text-sm px-2 py-1 rounded-3 hover:bg-gray-300
                flex="~ gap1" items-center
                :aria-label="$t('action.remove_quote')"
                @click="removeQuote"
              >
                <div i-ri:close-line />
                {{ $t('action.remove_quote') }}
              </button>
            </div>
            <blockquote v-if="quotedStatus" b="~ base 1" rounded-lg overflow-hidden my-3>
              <StatusCard
                :status="quotedStatus"
                :actions="false"
                :is-nested="true"
              />
            </blockquote>
            <div v-else-if="quoteFetchError" text-danger b="base 1" rounded-lg hover:bg-active my-3 p-3>
              {{ $t('error.quote_fetch_error') }} ({{ quoteFetchError }})
            </div>
            <StatusCardSkeleton v-else b="base 1" rounded-lg hover:bg-active my-3 />
          </template>

          <!-- toolbar -->
          <div v-if="shouldExpanded" flex="~ gap-1 1 wrap" m="s--1" pt-2 justify="end" max-w-full border="t base">
            <PublishEmojiPicker @select="insertEmoji" @select-custom="insertCustomEmoji">
              <button btn-action-icon :title="$t('tooltip.emojis')" :aria-label="$t('tooltip.add_emojis')">
                <div i-ri:emotion-line />
              </button>
            </PublishEmojiPicker>

            <CommonTooltip
              v-if="draft.params.poll === undefined" placement="top" :content="$t('tooltip.add_media')"
            >
              <button btn-action-icon :aria-label="$t('tooltip.add_media')" @click="pickAttachments">
                <div i-ri:image-add-line />
              </button>
            </CommonTooltip>

            <template v-if="draft.attachments.length === 0">
              <CommonTooltip v-if="!draft.params.poll" placement="top" :content="$t('polls.create')">
                <button
                  btn-action-icon :aria-label="$t('polls.create')"
                  @click="draft.params.poll = { options: [''], expiresIn: expiresInOptions[expiresInDefaultOptionIndex].seconds }"
                >
                  <div i-ri:chat-poll-line />
                </button>
              </CommonTooltip>
              <div v-else rounded-full b-1 border-dark flex="~ row" gap-1>
                <CommonTooltip placement="top" :content="$t('polls.cancel')">
                  <button
                    btn-action-icon b-r border-dark :aria-label="$t('polls.cancel')"
                    @click="draft.params.poll = undefined"
                  >
                    <div i-ri:close-line />
                  </button>
                </CommonTooltip>
                <CommonDropdown placement="top">
                  <CommonTooltip placement="top" :content="$t('polls.settings')">
                    <button :aria-label="$t('polls.settings')" btn-action-icon w-12>
                      <div i-ri:list-settings-line />
                      <div i-ri:arrow-down-s-line text-sm text-secondary me--1 />
                    </button>
                  </CommonTooltip>
                  <template #popper>
                    <div flex="~ col" gap-1 p-2>
                      <CommonCheckbox
                        v-model="draft.params.poll.multiple"
                        :label="draft.params.poll.multiple ? $t('polls.disallow_multiple') : $t('polls.allow_multiple')"
                        px-2 gap-3 h-9 flex justify-center hover:bg-active rounded-full
                        icon-checked="i-ri:checkbox-multiple-blank-line"
                        icon-unchecked="i-ri:checkbox-blank-circle-line"
                      />
                      <CommonCheckbox
                        v-model="draft.params.poll.hideTotals"
                        :label="draft.params.poll.hideTotals ? $t('polls.show_votes') : $t('polls.hide_votes')" px-2
                        gap-3
                        h-9 flex justify-center hover:bg-active rounded-full icon-checked="i-ri:eye-close-line"
                        icon-unchecked="i-ri:eye-line"
                      />
                    </div>
                  </template>
                </CommonDropdown>
                <CommonDropdown placement="bottom">
                  <CommonTooltip placement="top" :content="$t('polls.expiration')">
                    <button :aria-label="$t('polls.expiration')" btn-action-icon w-12>
                      <div i-ri:hourglass-line />
                      <div i-ri:arrow-down-s-line text-sm text-secondary me--1 />
                    </button>
                  </CommonTooltip>
                  <template #popper>
                    <CommonDropdownItem
                      v-for="expiresInOption in expiresInOptions" :key="expiresInOption.seconds"
                      :text="expiresInOption.label"
                      :checked="draft.params.poll!.expiresIn === expiresInOption.seconds"
                      @click="draft.params.poll!.expiresIn = expiresInOption.seconds"
                    />
                  </template>
                </CommonDropdown>
              </div>
            </template>

            <PublishEditorTools v-if="editor" :editor="editor" />
            <CommonDropdown placement="bottom" @click="setInitialScheduledTime">
              <CommonTooltip placement="top" :content="$t('tooltip.schedule_post')" no-auto-focus>
                <button btn-action-icon :aria-label="$t('tooltip.schedule_post')">
                  <div i-ri:calendar-schedule-line :class="scheduledTime !== '' ? 'text-primary' : ''" />
                </button>
              </CommonTooltip>
              <template #popper>
                <input
                  v-model="scheduledTime"
                  p2
                  type="datetime-local"
                  name="schedule-datetime"
                  :min="getDatetimeInputFormat(minimumScheduledTime)"
                >
              </template>
            </CommonDropdown>

            <div flex-auto />

            <PublishCharacterCounter :max="characterLimit" :length="characterCount" />

            <CommonTooltip placement="top" :content="$t('tooltip.change_language')">
              <CommonDropdown placement="bottom" auto-boundary-max-size>
                <button btn-action-icon :aria-label="$t('tooltip.change_language')" w-max mr1>
                  <span v-if="postLanguageDisplay" text-secondary text-sm ml1>{{ postLanguageDisplay }}</span>
                  <div v-else i-ri:translate-2 />
                  <div i-ri:arrow-down-s-line text-sm text-secondary me--1 />
                </button>

                <template #popper>
                  <PublishLanguagePicker v-model="draft.params.language" min-w-80 />
                </template>
              </CommonDropdown>
            </CommonTooltip>

            <CommonTooltip placement="top" :content="$t('tooltip.add_content_warning')">
              <button btn-action-icon :aria-label="$t('tooltip.add_content_warning')" @click="toggleSensitive">
                <div v-if="draft.params.sensitive" i-ri:alarm-warning-fill text-orange />
                <div v-else i-ri:alarm-warning-line />
              </button>
            </CommonTooltip>

            <PublishVisibilityPicker v-model="draft.params.visibility" :editing="!!draft.editingStatus">
              <template #default="{ visibility }">
                <button
                  :disabled="!!draft.editingStatus" :aria-label="$t('tooltip.change_content_visibility')"
                  btn-action-icon :class="{ 'w-12': !draft.editingStatus }"
                >
                  <div :class="visibility.icon" />
                  <div v-if="!draft.editingStatus" i-ri:arrow-down-s-line text-sm text-secondary me--1 />
                </button>
              </template>
            </PublishVisibilityPicker>

            <PublishQuoteApprovalPicker v-if="hasQuote" v-model="draft.params.quoteApprovalPolicy" :editing="!!draft.editingStatus">
              <template #default="{ quoteApprovalPolicy }">
                <button
                  :disabled="!!draft.editingStatus" :aria-label="$t('tooltip.change_content_visibility')"
                  btn-action-icon :class="{ 'w-12': !draft.editingStatus }"
                >
                  <div :class="quoteApprovalPolicy.icon" />
                  <div v-if="!draft.editingStatus" i-ri:arrow-down-s-line text-sm text-secondary me--1 />
                </button>
              </template>
            </PublishQuoteApprovalPicker>

            <PublishThreadTools :draft-item-index="draftItemIndex" :draft-key="draftKey" />

            <CommonTooltip
              v-if="failedMessages.length > 0" id="publish-failed-tooltip" placement="top"
              :content="scheduledTime ? $t('state.schedule_failed') : $t('tooltip.publish_failed')"
            >
              <button
                btn-danger rounded-3 text-sm w-full flex="~ gap1" items-center md:w-fit
                aria-describedby="publish-failed-tooltip"
              >
                <span block>
                  <div block i-carbon:face-dizzy-filled />
                </span>
                <span>{{ scheduledTime ? $t('state.schedule_failed') : $t('state.publish_failed') }}</span>
              </button>
            </CommonTooltip>

            <CommonTooltip
              v-else id="publish-tooltip" placement="top" :content="$t('tooltip.add_publishable_content')"
              :disabled="!(isPublishDisabled || isExceedingCharacterLimit)"
            >
              <button
                v-if="!threadIsActive || isFinalItemOfThread"
                btn-solid rounded-3 text-sm w-full flex="~ gap1" items-center md:w-fit class="publish-button"
                :aria-disabled="isPublishDisabled || isExceedingCharacterLimit || threadIsSending || !isValidScheduledTime"
                aria-describedby="publish-tooltip"
                :disabled="isPublishDisabled || isExceedingCharacterLimit || threadIsSending || !isValidScheduledTime"
                @click="publish"
              >
                <span v-if="isSending || threadIsSending" block animate-spin preserve-3d>
                  <div block i-ri:loader-2-fill />
                </span>
                <span v-if="failedMessages.length" block>
                  <div block i-carbon:face-dizzy-filled />
                </span>
                <template v-if="threadIsActive">
                  <span>{{ !threadIsSending ? $t('action.publish_thread') : $t('state.publishing') }} </span>
                </template>
                <template v-else>
                  <span v-if="draft.editingStatus">{{ $t('action.save_changes') }}</span>
                  <span v-else-if="scheduledTime">{{
                    !isSending ? $t('action.schedule') : $t('state.scheduling')
                  }}</span>
                  <span v-else-if="draft.params.inReplyToId">{{ $t('action.reply') }}</span>
                  <span v-else>{{ !isSending ? $t('action.publish') : $t('state.publishing') }}</span>
                </template>
              </button>
            </CommonTooltip>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.publish-button[aria-disabled=true] {
  cursor: not-allowed;
  background-color: var(--c-bg-btn-disabled);
  color: var(--c-text-btn-disabled);
}

.publish-button[aria-disabled=true]:hover {
  background-color: var(--c-bg-btn-disabled);
  color: var(--c-text-btn-disabled);
}

.option-input:focus + .delete-button {
  display: none;
}

.option-input:not(:focus) + .delete-button + .char-limit-radial {
  display: none;
}

.char-limit-radial {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

input[name="schedule-datetime"]:invalid {
  color: var(--c-danger);
}
</style>
