import { fileOpen } from 'browser-fs-access'
import type { Ref } from 'vue'
import type { mastodon } from 'masto'
import type { UseDraft } from './statusDrafts'
import type { Draft } from '~~/types'

export const usePublish = (options: {
  draftState: UseDraft
  expanded: Ref<boolean>
  isUploading: Ref<boolean>
  initialDraft: Ref<() => Draft>
}) => {
  const { expanded, isUploading, initialDraft } = $(options)
  let { draft, isEmpty } = $(options.draftState)
  const { client } = $(useMasto())

  let isSending = $ref(false)
  const isExpanded = $ref(false)

  const shouldExpanded = $computed(() => expanded || isExpanded || !isEmpty)
  const isPublishDisabled = $computed(() => {
    return isEmpty || isUploading || isSending || (draft.attachments.length === 0 && !draft.params.status)
  })

  async function publishDraft() {
    let content = htmlToText(draft.params.status || '')
    if (draft.mentions?.length)
      content = `${draft.mentions.map(i => `@${i}`).join(' ')} ${content}`

    const payload = {
      ...draft.params,
      status: content,
      mediaIds: draft.attachments.map(a => a.id),
      ...(isGlitchEdition.value ? { 'content-type': 'text/markdown' } : {}),
    } as mastodon.v1.CreateStatusParams

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

      let status: mastodon.v1.Status
      if (!draft.editingStatus)
        status = await client.v1.statuses.create(payload)
      else
        status = await client.v1.statuses.update(draft.editingStatus.id, payload)
      if (draft.params.inReplyToId)
        navigateToStatus({ status })

      draft = initialDraft()

      return status
    }
    catch (err) {
      console.error(err)
    }
    finally {
      isSending = false
    }
  }

  return $$({
    isSending,
    isExpanded,
    shouldExpanded,
    isPublishDisabled,

    publishDraft,
  })
}

export type MediaAttachmentUploadError = [filename: string, message: string]

export const useUploadMediaAttachment = (draftRef: Ref<Draft>) => {
  const draft = $(draftRef)
  const { client } = $(useMasto())
  const { t } = useI18n()

  let isUploading = $ref<boolean>(false)
  let isExceedingAttachmentLimit = $ref<boolean>(false)
  let failedAttachments = $ref<MediaAttachmentUploadError[]>([])
  const dropZoneRef = ref<HTMLDivElement>()

  async function uploadAttachments(files: File[]) {
    isUploading = true
    failedAttachments = []
    // TODO: display some kind of message if too many media are selected
    // DONE
    const limit = currentInstance.value!.configuration?.statuses.maxMediaAttachments || 4
    for (const file of files.slice(0, limit)) {
      if (draft.attachments.length < limit) {
        isExceedingAttachmentLimit = false
        try {
          const attachment = await client.v1.mediaAttachments.create({
            file,
          })
          draft.attachments.push(attachment)
        }
        catch (e) {
        // TODO: add some human-readable error message, problem is that masto api will not return response code
          console.error(e)
          failedAttachments = [...failedAttachments, [file.name, (e as Error).message]]
        }
      }
      else {
        isExceedingAttachmentLimit = true
        failedAttachments = [...failedAttachments, [file.name, t('state.attachments_limit_error')]]
      }
    }
    isUploading = false
  }

  async function pickAttachments() {
    const mimeTypes = currentInstance.value!.configuration?.mediaAttachments.supportedMimeTypes
    const files = await fileOpen({
      description: 'Attachments',
      multiple: true,
      mimeTypes,
    })
    await uploadAttachments(files)
  }

  async function setDescription(att: mastodon.v1.MediaAttachment, description: string) {
    att.description = description
    await client.v1.mediaAttachments.update(att.id, { description: att.description })
  }

  function removeAttachment(index: number) {
    draft.attachments.splice(index, 1)
  }

  async function onDrop(files: File[] | null) {
    if (files)
      await uploadAttachments(files)
  }

  const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

  return $$({
    isUploading,
    isExceedingAttachmentLimit,
    failedAttachments,
    dropZoneRef,
    isOverDropZone,

    uploadAttachments,
    pickAttachments,
    setDescription,
    removeAttachment,
  })
}
