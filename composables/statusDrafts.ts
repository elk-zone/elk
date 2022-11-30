import type { Account, Attachment, CreateStatusParams, Status } from 'masto'
import { STORAGE_KEY_DRAFTS } from '~/constants'
import type { Mutable } from '~/types/utils'

export interface Draft {
  editingStatus?: Status
  params: Omit<Mutable<CreateStatusParams>, 'status'> & {
    status?: Exclude<CreateStatusParams['status'], null>
  }
  attachments: Attachment[]
}
export type DraftMap = Record<string, Draft>

const allDrafts = useLocalStorage<Record<string, DraftMap>>(STORAGE_KEY_DRAFTS, {})

export const currentUserDrafts = computed(() => {
  if (!currentUser.value?.account.id)
    return {}
  const id = `${currentUser.value.account.acct}@${currentUser.value.server}`
  if (!allDrafts.value[id])
    allDrafts.value[id] = {}
  return allDrafts.value[id]
})

export function getDefaultDraft(options: Partial<Draft['params'] & Omit<Draft, 'params'>> = {}): Draft {
  const {
    status = '',
    inReplyToId,
    visibility = 'public',
    attachments = [],
  } = options

  return {
    params: {
      status,
      inReplyToId,
      visibility,
    },
    attachments,
  }
}

export function getDraftFromStatus(status: Status, text?: null | string): Draft {
  return getDefaultDraft({
    status: text || convertMastodonHTML(status.content),
    mediaIds: status.mediaAttachments.map(att => att.id),
    visibility: status.visibility,
    attachments: status.mediaAttachments,
  })
}

export function getReplyDraft(status: Status) {
  return {
    key: `reply-${status.id}`,
    draft: () => getDefaultDraft({
      inReplyToId: status!.id,
      visibility: status.visibility,
    }),
  }
}

export const isEmptyDraft = (draft: Draft | null | undefined) => {
  if (!draft)
    return true
  const { params, attachments } = draft
  const status = params.status || ''
  return (status.length === 0 || status === '<p></p>')
    && attachments.length === 0
    && (params.spoilerText || '').length === 0
}

export function useDraft(
  draftKey: string,
  initial: () => Draft = () => getDefaultDraft({}),
) {
  const draft = computed({
    get() {
      if (!currentUserDrafts.value[draftKey])
        currentUserDrafts.value[draftKey] = initial()
      return currentUserDrafts.value[draftKey]
    },
    set(val) {
      currentUserDrafts.value[draftKey] = val
    },
  })

  const isEmpty = computed(() => isEmptyDraft(draft.value))

  onUnmounted(async () => {
    // Remove draft if it's empty
    if (isEmpty.value) {
      await nextTick()
      delete currentUserDrafts.value[draftKey]
    }
  })

  return { draft, isEmpty }
}

export function mentionUser(account: Account) {
  openPublishDialog('dialog', getDefaultDraft({
    status: `@${account.acct} `,
  }), true)
}

export function directMessageUser(account: Account) {
  openPublishDialog('dialog', getDefaultDraft({
    status: `@${account.acct} `,
    visibility: 'direct',
  }), true)
}

export function clearUserDrafts(account?: Account) {
  if (!account)
    account = currentUser.value?.account

  if (!account)
    return

  const id = `${account.acct}@${currentUser.value?.server}`
  if (!allDrafts.value[id])
    return

  delete allDrafts.value[id]
}
