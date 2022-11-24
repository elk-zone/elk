import type { Attachment, CreateStatusParams, Status } from 'masto'
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

export function getDefaultDraft(inReplyToId?: string): Draft {
  return {
    params: {
      status: '',
      inReplyToId,
      visibility: 'public',
    },
    attachments: [],
  }
}

export function getParamsFromStatus(status: Status) {
  return {
    status: status.content,
    mediaIds: status.mediaAttachments.map(att => att.id),
    visibility: status.visibility,
  }
}

export function useDraft(draftKey: string, inReplyToId?: string) {
  const draft = computed({
    get() {
      if (!currentUserDrafts.value[draftKey])
        currentUserDrafts.value[draftKey] = getDefaultDraft(inReplyToId)

      return currentUserDrafts.value[draftKey]
    },
    set(val) {
      currentUserDrafts.value[draftKey] = val
    },
  })

  const isEmpty = computed(() => {
    return (draft.value.params.status ?? '').trim().length === 0
      && draft.value.attachments.length === 0
  })

  return { draft, isEmpty }
}

export const dialogDraft = useDraft('dialog')
