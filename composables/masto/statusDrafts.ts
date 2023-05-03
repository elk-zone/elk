import type { mastodon } from 'masto'
import type { ComputedRef, Ref } from 'vue'
import { STORAGE_KEY_DRAFTS } from '~/constants'
import type { Draft, DraftMap } from '~/types'
import type { Mutable } from '~/types/utils'

export const currentUserDrafts = (process.server || process.test)
  ? computed<DraftMap>(() => ({}))
  : useUserLocalStorage<DraftMap>(STORAGE_KEY_DRAFTS, () => ({}))

export const builtinDraftKeys = [
  'dialog',
  'home',
]

const ALL_VISIBILITY = ['public', 'unlisted', 'private', 'direct'] as const

function getDefaultVisibility(currentVisibility: mastodon.v1.StatusVisibility) {
  // The default privacy only should be taken into account if it makes
  // the post more private than the replying to post
  const preferredVisibility = currentUser.value?.account.source.privacy || 'public'
  return ALL_VISIBILITY.indexOf(currentVisibility)
   > ALL_VISIBILITY.indexOf(preferredVisibility)
    ? currentVisibility
    : preferredVisibility
}

export function getDefaultDraft(options: Partial<Mutable<mastodon.v1.CreateStatusParams> & Omit<Draft, 'params'>> = {}): Draft {
  const {
    attachments = [],
    initialText = '',
    status,
    inReplyToId,
    visibility,
    sensitive,
    spoilerText,
    language,
    mentions,
  } = options

  return {
    attachments,
    initialText,
    params: {
      status: status || '',
      inReplyToId,
      visibility: getDefaultVisibility(visibility || 'public'),
      sensitive: sensitive ?? false,
      spoilerText: spoilerText || '',
      language: language || '', // auto inferred from current language on posting
    },
    mentions,
    lastUpdated: Date.now(),
  }
}

export async function getDraftFromStatus(status: mastodon.v1.Status): Promise<Draft> {
  return getDefaultDraft({
    status: await convertMastodonHTML(status.content),
    mediaIds: status.mediaAttachments.map(att => att.id),
    visibility: status.visibility,
    attachments: status.mediaAttachments,
    sensitive: status.sensitive,
    spoilerText: status.spoilerText,
    language: status.language,
    inReplyToId: status.inReplyToId,
  })
}

function getAccountsToMention(status: mastodon.v1.Status) {
  const userId = currentUser.value?.account.id
  const accountsToMention = new Set<string>()
  if (status.account.id !== userId)
    accountsToMention.add(status.account.acct)
  status.mentions
    .filter(mention => mention.id !== userId)
    .map(mention => mention.acct)
    .forEach(i => accountsToMention.add(i))
  return Array.from(accountsToMention)
}

export function getReplyDraft(status: mastodon.v1.Status) {
  const accountsToMention = getAccountsToMention(status)
  return {
    key: `reply-${status.id}`,
    draft: () => {
      return getDefaultDraft({
        initialText: '',
        inReplyToId: status!.id,
        sensitive: status.sensitive,
        spoilerText: status.spoilerText,
        visibility: status.visibility,
        mentions: accountsToMention,
        language: status.language,
      })
    },
  }
}

export function isEmptyDraft(draft: Draft | null | undefined) {
  if (!draft)
    return true
  const { params, attachments } = draft
  const status = params.status || ''
  const text = htmlToText(status).trim().replace(/^(@\S+\s?)+/, '').replaceAll(/```/g, '').trim()

  return (text.length === 0)
    && attachments.length === 0
}

export interface UseDraft {
  draft: Ref<Draft>
  isEmpty: ComputedRef<boolean>
}

export function useDraft(
  draftKey?: string,
  initial: () => Draft = () => getDefaultDraft({}),
): UseDraft {
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

export function mentionUser(account: mastodon.v1.Account) {
  openPublishDialog('dialog', getDefaultDraft({
    status: `@${account.acct} `,
  }))
}

export function directMessageUser(account: mastodon.v1.Account) {
  openPublishDialog('dialog', getDefaultDraft({
    status: `@${account.acct} `,
    visibility: 'direct',
  }))
}

export function clearEmptyDrafts() {
  for (const key in currentUserDrafts.value) {
    if (builtinDraftKeys.includes(key) && !isEmptyDraft(currentUserDrafts.value[key]))
      continue
    if (!currentUserDrafts.value[key].params || isEmptyDraft(currentUserDrafts.value[key]))
      delete currentUserDrafts.value[key]
  }
}
