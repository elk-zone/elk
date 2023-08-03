import { fileOpen } from 'browser-fs-access'
import type { Ref } from 'vue'
import type { mastodon } from 'masto'
import type { UseDraft } from './statusDrafts'
import type { Draft } from '~~/types'

export function usePublish(options: {
  draftState: UseDraft
  expanded: Ref<boolean>
  isUploading: Ref<boolean>
  initialDraft: Ref<() => Draft>
}) {
  const { expanded, isUploading, initialDraft } = $(options)
  let { draft, isEmpty } = $(options.draftState)
  const { client } = $(useMasto())
  const settings = useUserSettings()

  const preferredLanguage = $computed(() => (currentUser.value?.account.source.language || settings.value?.language || 'en').split('-')[0])

  let isSending = $ref(false)
  const isExpanded = $ref(false)
  const failedMessages = $ref<string[]>([])

  const publishSpoilerText = $computed({
    get() {
      return draft.params.sensitive ? draft.params.spoilerText : ''
    },
    set(val) {
      if (!draft.params.sensitive)
        return
      draft.params.spoilerText = val
    },
  })

  const shouldExpanded = $computed(() => expanded || isExpanded || !isEmpty)
  const isPublishDisabled = $computed(() => {
    const firstEmptyInputIndex = draft.params.poll?.options.findIndex(option => option.trim().length === 0)

    return isEmpty
          || isUploading
          || isSending
          || (draft.attachments.length === 0 && !draft.params.status)
          || failedMessages.length > 0
          || (draft.attachments.length > 0 && draft.params.poll !== null && draft.params.poll !== undefined)
          || ((draft.params.poll !== null && draft.params.poll !== undefined)
              && (
                (firstEmptyInputIndex !== -1
                 && firstEmptyInputIndex !== draft.params.poll.options.length - 1
                )
                || draft.params.poll.options.findLastIndex(option => option.trim().length > 0) + 1 < 2
                || (new Set(draft.params.poll.options).size !== draft.params.poll.options.length)
                || (currentInstance.value?.configuration?.polls.maxCharactersPerOption !== undefined
                    && draft.params.poll.options.find(option => option.length > currentInstance.value!.configuration!.polls.maxCharactersPerOption) !== undefined
                )
              )
          )
  })

  watch(() => draft, () => {
    if (failedMessages.length > 0)
      failedMessages.length = 0
  }, { deep: true })

  async function publishDraft() {
    if (isPublishDisabled)
      return

    let content = htmlToText(draft.params.status || '')
    if (draft.mentions?.length)
      content = `${draft.mentions.map(i => `@${i}`).join(' ')} ${content}`

    let poll

    if (draft.params.poll) {
      let options = draft.params.poll.options

      if (currentInstance.value?.configuration !== undefined
        && (
          options.length < currentInstance.value.configuration.polls.maxOptions
          || options[options.length - 1].trim().length === 0
        )
      )
        options = options.slice(0, options.length - 1)

      poll = { ...draft.params.poll, options }
    }

    const payload = {
      ...draft.params,
      spoilerText: publishSpoilerText,
      status: content,
      mediaIds: draft.attachments.map(a => a.id),
      language: draft.params.language || preferredLanguage,
      poll,
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
      if (!draft.editingStatus) {
        status = await client.v1.statuses.create(payload)
      }

      else {
        const updatePayload = {
          ...payload,
          mediaAttributes: draft.attachments.map(media => ({
            id: media.id,
            description: media.description,
          })),
        } as mastodon.v1.UpdateStatusParams
        status = await client.v1.statuses.update(draft.editingStatus.id, updatePayload)
      }
      if (draft.params.inReplyToId)
        navigateToStatus({ status })

      draft = initialDraft()

      return status
    }
    catch (err) {
      console.error(err)
      failedMessages.push((err as Error).message)
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
    failedMessages,
    preferredLanguage,
    publishSpoilerText,
    publishDraft,
  })
}

export type MediaAttachmentUploadError = [filename: string, message: string]

export function useUploadMediaAttachment(draftRef: Ref<Draft>) {
  const draft = $(draftRef)
  const { client } = $(useMasto())
  const { t } = useI18n()

  let isUploading = $ref<boolean>(false)
  let isExceedingAttachmentLimit = $ref<boolean>(false)
  let failedAttachments = $ref<MediaAttachmentUploadError[]>([])
  const dropZoneRef = ref<HTMLDivElement>()

  const maxPixels = $computed(() => {
    return currentInstance.value?.configuration?.mediaAttachments?.imageMatrixLimit
        ?? 4096 ** 2
  })

  const loadImage = (inputFile: Blob) => new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(inputFile)
    const img = new Image()

    img.onerror = err => reject(err)
    img.onload = () => resolve(img)

    img.src = url
  })

  function resizeImage(img: HTMLImageElement, type = 'image/png'): Promise<Blob | null> {
    const { width, height } = img

    const aspectRatio = (width as number) / (height as number)

    const canvas = document.createElement('canvas')

    const resizedWidth = canvas.width = Math.round(Math.sqrt(maxPixels * aspectRatio))
    const resizedHeight = canvas.height = Math.round(Math.sqrt(maxPixels / aspectRatio))

    const context = canvas.getContext('2d')

    context?.drawImage(img, 0, 0, resizedWidth, resizedHeight)

    return new Promise((resolve) => {
      canvas.toBlob(resolve, type)
    })
  }

  async function processImageFile(file: File) {
    try {
      const image = await loadImage(file) as HTMLImageElement

      if (image.width * image.height > maxPixels)
        file = await resizeImage(image, file.type) as File

      return file
    }
    catch (e) {
      // Resize failed, just use the original file
      console.error(e)
      return file
    }
  }

  async function processFile(file: File) {
    if (file.type.startsWith('image/'))
      return await processImageFile(file)

    return file
  }

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
            file: await processFile(file),
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
    if (process.server)
      return
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
    if (!draft.editingStatus)
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
    isOverDropZone,

    failedAttachments,
    dropZoneRef,

    uploadAttachments,
    pickAttachments,
    setDescription,
    removeAttachment,
  })
}
