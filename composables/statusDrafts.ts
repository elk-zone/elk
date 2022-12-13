import type { Account, Status } from 'masto'
import { STORAGE_KEY_DRAFTS } from '~/constants'
import type { Draft, DraftMap } from '~/types'

export const currentUserDrafts = useUserLocalStorage<DraftMap>(STORAGE_KEY_DRAFTS, () => ({}))

export function getDefaultDraft(options: Partial<Draft['params'] & Omit<Draft, 'params'>> = {}): Draft {
  const {
    status = '',
    inReplyToId,
    visibility = 'public',
    attachments = [],
    initialText = '',
  } = options

  return {
    params: {
      status,
      inReplyToId,
      visibility,
    },
    attachments,
    initialText,
  }
}

export async function getDraftFromStatus(status: Status, text?: null | string): Promise<Draft> {
  return getDefaultDraft({
    status: text || await convertMastodonHTML(status.content),
    mediaIds: status.mediaAttachments.map(att => att.id),
    visibility: status.visibility,
    attachments: status.mediaAttachments,
  })
}

function mentionHTML(acct: string) {
  return `<span data-type="mention" data-id="${acct}" contenteditable="false">@${acct}</span>`
}

export function getReplyDraft(status: Status) {
  const accountsToMention: string[] = []
  const userId = currentUser.value?.account.id
  if (status.account.id !== userId)
    accountsToMention.push(status.account.acct)
  accountsToMention.push(...(status.mentions.filter(mention => mention.id !== userId).map(mention => mention.acct)))
  return {
    key: `reply-${status.id}`,
    draft: () => {
      return getDefaultDraft({
        initialText: accountsToMention.map(acct => mentionHTML(acct)).join(' '),
        inReplyToId: status!.id,
        visibility: status.visibility,
      })
    },
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
