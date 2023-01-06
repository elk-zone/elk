import type { Account, CreateStatusParams, Status } from 'masto'
import { STORAGE_KEY_DRAFTS } from '~/constants'
import type { Draft, DraftMap } from '~/types'
import type { Mutable } from '~/types/utils'

export const currentUserDrafts = process.server ? computed<DraftMap>(() => ({})) : useUserLocalStorage<DraftMap>(STORAGE_KEY_DRAFTS, () => ({}))

export const builtinDraftKeys = [
  'dialog',
  'home',
]

export function getDefaultDraft(options: Partial<Mutable<CreateStatusParams> & Omit<Draft, 'params'>> = {}): Draft {
  const {
    attachments = [],
    initialText = '',

    status,
    inReplyToId,
    visibility,
    sensitive,
    spoilerText,
    language,
  } = options

  return {
    attachments,
    initialText,
    params: {
      status: status || '',
      inReplyToId,
      visibility: visibility || 'public',
      sensitive: sensitive ?? false,
      spoilerText: spoilerText || '',
      language: language || 'en',
    },
    lastUpdated: Date.now(),
  }
}

export async function getDraftFromStatus(status: Status): Promise<Draft> {
  return getDefaultDraft({
    status: await convertMastodonHTML(status.content),
    mediaIds: status.mediaAttachments.map(att => att.id),
    visibility: status.visibility,
    attachments: status.mediaAttachments,
    sensitive: status.sensitive,
    spoilerText: status.spoilerText,
    language: status.language,
  })
}

function mentionHTML(acct: string) {
  return `<span data-type="mention" data-id="${acct}" contenteditable="false">@${acct}</span>`
}

export function getReplyDraft(status: Status) {
  const accountsToMention: string[] = []
  const userId = currentUser.value.account!.id
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
  draftKey?: string,
  initial: () => Draft = () => getDefaultDraft({}),
) {
  const draft = draftKey
    ? computed({
      get() {
        if (!currentUserDrafts.value[draftKey])
          currentUserDrafts.value[draftKey] = initial()
        return currentUserDrafts.value[draftKey]
      },
      set(val) {
        currentUserDrafts.value[draftKey] = val
      },
    })
    : ref(initial())

  const isEmpty = computed(() => isEmptyDraft(draft.value))

  onUnmounted(async () => {
    // Remove draft if it's empty
    if (isEmpty.value && draftKey) {
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

export function clearEmptyDrafts() {
  for (const key in currentUserDrafts.value) {
    if (builtinDraftKeys.includes(key))
      continue
    if (!currentUserDrafts.value[key].params || isEmptyDraft(currentUserDrafts.value[key]))
      delete currentUserDrafts.value[key]
  }
}
