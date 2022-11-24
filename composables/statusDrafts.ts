import type { Attachment, CreateStatusParamsWithStatus } from 'masto'
import { STORAGE_KEY_DRAFTS } from '~/constants'

export type DraftMap = Record<string, {
  params: CreateStatusParamsWithStatus
  attachments: Attachment[]
}>

const allDrafts = useLocalStorage<Record<string, DraftMap>>(STORAGE_KEY_DRAFTS, {})

export const currentUserDrafts = computed(() => {
  if (!currentUser.value?.account?.id)
    return {}
  const id = `${currentUser.value.account.acct}@${currentUser.value.server}`
  if (!allDrafts.value[id])
    allDrafts.value[id] = {}
  return allDrafts.value[id]
})
