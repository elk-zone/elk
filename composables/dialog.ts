import type { mastodon } from 'masto'
import type { ConfirmDialogChoice, ConfirmDialogLabel, Draft, ErrorDialogData } from '~/types'
import { STORAGE_KEY_FIRST_VISIT } from '~/constants'

export const confirmDialogChoice = ref<ConfirmDialogChoice>()
export const confirmDialogLabel = ref<ConfirmDialogLabel>()
export const errorDialogData = ref<ErrorDialogData>()

export const mediaPreviewList = ref<mastodon.v1.MediaAttachment[]>([])
export const mediaPreviewIndex = ref(0)

export const statusEdit = ref<mastodon.v1.StatusEdit>()
export const dialogDraftKey = ref<string>()

export const commandPanelInput = ref('')

export const isFirstVisit = useLocalStorage(STORAGE_KEY_FIRST_VISIT, !process.mock)

export const isSigninDialogOpen = ref(false)
export const isPublishDialogOpen = ref(false)
export const isMediaPreviewOpen = ref(false)
export const isEditHistoryDialogOpen = ref(false)
export const isPreviewHelpOpen = ref(isFirstVisit.value)
export const isCommandPanelOpen = ref(false)
export const isConfirmDialogOpen = ref(false)
export const isErrorDialogOpen = ref(false)
export const isFavouritedBoostedByDialogOpen = ref(false)

export const lastPublishDialogStatus = ref<mastodon.v1.Status | null>(null)

export const favouritedBoostedByStatusId = ref<string | null>(null)

export function openSigninDialog() {
  isSigninDialogOpen.value = true
}

export async function openConfirmDialog(label: ConfirmDialogLabel | string): Promise<ConfirmDialogChoice> {
  confirmDialogLabel.value = typeof label === 'string' ? { title: label } : label
  confirmDialogChoice.value = undefined
  isConfirmDialogOpen.value = true

  await until(isConfirmDialogOpen).toBe(false)

  return confirmDialogChoice.value!
}

export async function openPublishDialog(draftKey = 'dialog', draft?: Draft, overwrite = false): Promise<void> {
  dialogDraftKey.value = draftKey

  if (draft) {
    if (overwrite && !isEmptyDraft(currentUserDrafts.value[draftKey])) {
      // TODO overwrite warning
      // TODO don't overwrite, have a draft list
      if (process.dev) {
        // eslint-disable-next-line no-alert
        const result = confirm('[DEV] Are you sure you overwrite draft content?')
        if (!result)
          return
      }
    }

    if (overwrite || !currentUserDrafts.value[draftKey])
      currentUserDrafts.value[draftKey] = draft
  }
  isPublishDialogOpen.value = true

  await until(isPublishDialogOpen).toBe(false)
}

export async function openFavoridedBoostedByDialog(statusId: string) {
  isFavouritedBoostedByDialogOpen.value = true
  favouritedBoostedByStatusId.value = statusId
}

if (isPreviewHelpOpen.value) {
  watch(isPreviewHelpOpen, () => {
    isFirstVisit.value = false
  })
}

function restoreMediaPreviewFromState() {
  mediaPreviewList.value = JSON.parse(history.state?.mediaPreviewList ?? '[]')
  mediaPreviewIndex.value = history.state?.mediaPreviewIndex ?? 0
  isMediaPreviewOpen.value = history.state?.mediaPreview ?? false
}

if (process.client) {
  window.addEventListener('popstate', restoreMediaPreviewFromState)

  restoreMediaPreviewFromState()
}

export function openMediaPreview(attachments: mastodon.v1.MediaAttachment[], index = 0) {
  mediaPreviewList.value = attachments
  mediaPreviewIndex.value = index
  isMediaPreviewOpen.value = true

  history.pushState({
    ...history.state,
    mediaPreview: true,
    mediaPreviewList: JSON.stringify(attachments),
    mediaPreviewIndex: index,
  }, '')
}

export async function openErrorDialog(data: ErrorDialogData) {
  errorDialogData.value = data
  isErrorDialogOpen.value = true

  await until(isErrorDialogOpen).toBe(false)
}

export function closeErrorDialog() {
  isErrorDialogOpen.value = false
}

export function closeMediaPreview() {
  history.back()
}

export function openEditHistoryDialog(edit: mastodon.v1.StatusEdit) {
  statusEdit.value = edit
  isEditHistoryDialogOpen.value = true
}

export function openPreviewHelp() {
  isPreviewHelpOpen.value = true
}

export function closePreviewHelp() {
  isPreviewHelpOpen.value = false
}

export function openCommandPanel(isCommandMode = false) {
  commandPanelInput.value = isCommandMode ? '> ' : ''
  isCommandPanelOpen.value = true
}

export function closeCommandPanel() {
  isCommandPanelOpen.value = false
}
