import type { mastodon } from 'masto'
import type { Ref } from 'vue'
import type { DraftItem } from '~~/types'
import { fileOpen } from 'browser-fs-access'

export function usePublish(options: {
  draftItem: Ref<DraftItem>
  expanded: Ref<boolean>
  isUploading: Ref<boolean>
  isPartOfThread: boolean
  initialDraft: () => DraftItem
}) {
  const { draftItem } = options

  const isEmpty = computed(() => isEmptyDraft([draftItem.value]))

  const { client } = useMasto()
  const settings = useUserSettings()

  const preferredLanguage = computed(() => (currentUser.value?.account.source.language || settings.value?.language || 'en').split('-')[0])

  const isSending = ref(false)
  const isExpanded = ref(false)
  const failedMessages = ref<string[]>([])

  const publishSpoilerText = computed({
    get() {
      return draftItem.value.params.sensitive ? draftItem.value.params.spoilerText : ''
    },
    set(val) {
      if (!draftItem.value.params.sensitive)
        return
      draftItem.value.params.spoilerText = val
    },
  })

  const shouldExpanded = computed(() => options.expanded.value || isExpanded.value || !isEmpty.value)
  const isPublishDisabled = computed(() => {
    const { params, attachments } = draftItem.value
    const firstEmptyInputIndex = params.poll?.options.findIndex(option => option.trim().length === 0)
    return isEmpty.value
      || options.isUploading.value
      || isSending.value
      || (attachments.length === 0 && !params.status)
      || failedMessages.value.length > 0
      || (attachments.length > 0 && params.poll !== null && params.poll !== undefined)
      || ((params.poll !== null && params.poll !== undefined)
        && (
          (firstEmptyInputIndex !== -1
            && firstEmptyInputIndex !== params.poll.options.length - 1
          )
          || params.poll.options.findLastIndex(option => option.trim().length > 0) + 1 < 2
          || (new Set(params.poll.options).size !== params.poll.options.length)
          || (currentInstance.value?.configuration?.polls.maxCharactersPerOption !== undefined
            && params.poll.options.find(option => option.length > currentInstance.value!.configuration!.polls.maxCharactersPerOption) !== undefined
          )
        ))
  })

  watch(draftItem, () => {
    if (failedMessages.value.length > 0)
      failedMessages.value.length = 0
  }, { deep: true })

  async function publishDraft() {
    if (isPublishDisabled.value)
      return

    let content = htmlToText(draftItem.value.params.status || '')
    if (draftItem.value.mentions?.length)
      content = `${draftItem.value.mentions.map(i => `@${i}`).join(' ')} ${content}`

    let poll

    if (draftItem.value.params.poll) {
      let options = draftItem.value.params.poll.options

      if (currentInstance.value?.configuration !== undefined
        && (
          options.length < currentInstance.value.configuration.polls.maxOptions
          || options[options.length - 1].trim().length === 0
        )
      ) {
        options = options.slice(0, options.length - 1)
      }

      poll = { ...draftItem.value.params.poll, options }
    }

    const payload = {
      ...draftItem.value.params,
      spoilerText: publishSpoilerText.value,
      status: content,
      mediaIds: draftItem.value.attachments.map(a => a.id),
      language: draftItem.value.params.language || preferredLanguage.value,
      poll,
      ...(isGlitchEdition.value ? { 'content-type': 'text/markdown' } : {}),
    } as mastodon.rest.v1.CreateStatusParams

    if (import.meta.dev) {
      // eslint-disable-next-line no-console
      console.info({
        raw: draftItem.value.params.status,
        ...payload,
      })
      // eslint-disable-next-line no-alert
      const result = confirm('[DEV] Payload logged to console, do you want to publish it?')
      if (!result)
        return
    }

    try {
      isSending.value = true

      let status: mastodon.v1.Status
      if (!draftItem.value.editingStatus) {
        status = await client.value.v1.statuses.create(payload)
      }

      else {
        status = await client.value.v1.statuses.$select(draftItem.value.editingStatus.id).update({
          ...payload,
          mediaAttributes: draftItem.value.attachments.map(media => ({
            id: media.id,
            description: media.description,
          })),
        })
      }
      if (draftItem.value.params.inReplyToId && !options.isPartOfThread)
        navigateToStatus({ status })

      draftItem.value = options.initialDraft()

      return status
    }
    catch (err) {
      console.error(err)
      failedMessages.value.push((err as Error).message)
    }
    finally {
      isSending.value = false
    }
  }

  return {
    isSending,
    isExpanded,
    shouldExpanded,
    isPublishDisabled,
    failedMessages,
    preferredLanguage,
    publishSpoilerText,
    publishDraft,
  }
}

export type MediaAttachmentUploadError = [filename: string, message: string]

export function useUploadMediaAttachment(draft: Ref<DraftItem>) {
  const { client } = useMasto()
  const { t } = useI18n()
  const { formatFileSize } = useFileSizeFormatter()

  const isUploading = ref<boolean>(false)
  const isExceedingAttachmentLimit = ref<boolean>(false)
  const failedAttachments = ref<MediaAttachmentUploadError[]>([])
  const dropZoneRef = ref<HTMLDivElement>()

  const maxPixels = computed(() => {
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

    const resizedWidth = canvas.width = Math.round(Math.sqrt(maxPixels.value * aspectRatio))
    const resizedHeight = canvas.height = Math.round(Math.sqrt(maxPixels.value / aspectRatio))

    const context = canvas.getContext('2d')

    context?.drawImage(img, 0, 0, resizedWidth, resizedHeight)

    return new Promise((resolve) => {
      canvas.toBlob(resolve, type)
    })
  }

  async function processImageFile(file: File) {
    try {
      const image = await loadImage(file) as HTMLImageElement

      if (image.width * image.height > maxPixels.value)
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
    isUploading.value = true
    failedAttachments.value = []
    // TODO: display some kind of message if too many media are selected
    // DONE
    const limit = currentInstance.value!.configuration?.statuses.maxMediaAttachments || 4
    const maxVideoSize = currentInstance.value!.configuration?.mediaAttachments.videoSizeLimit || 0
    const maxImageSize = currentInstance.value!.configuration?.mediaAttachments.imageSizeLimit || 0
    for (const file of files.slice(0, limit)) {
      if (draft.value.attachments.length < limit) {
        if (file.type.startsWith('image/')) {
          if (maxImageSize > 0 && file.size > maxImageSize) {
            failedAttachments.value = [...failedAttachments.value, [file.name, t('state.attachments_limit_image_error', [formatFileSize(maxImageSize)])]]
            continue
          }
        }
        else {
          if (maxVideoSize > 0 && file.size > maxVideoSize) {
            const key
              = file.type.startsWith('audio/')
                ? 'state.attachments_limit_audio_error'
                : file.type.startsWith('video/')
                  ? 'state.attachments_limit_video_error'
                  : 'state.attachments_limit_unknown_error'
            const errorMessage = t(key, [formatFileSize(maxVideoSize)])
            failedAttachments.value = [
              ...failedAttachments.value,
              [file.name, errorMessage],
            ]
            continue
          }
        }
        isExceedingAttachmentLimit.value = false
        try {
          const attachment = await client.value.v1.media.create({
            file: await processFile(file),
          })
          draft.value.attachments.push(attachment)
        }
        catch (e) {
          // TODO: add some human-readable error message, problem is that masto api will not return response code
          console.error(e)
          failedAttachments.value = [...failedAttachments.value, [file.name, (e as Error).message]]
        }
      }
      else {
        isExceedingAttachmentLimit.value = true
        failedAttachments.value = [...failedAttachments.value, [file.name, t('state.attachments_limit_error')]]
      }
    }
    isUploading.value = false
  }

  async function pickAttachments() {
    if (import.meta.server)
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
    if (!draft.value.editingStatus)
      await client.value.v1.media.$select(att.id).update({ description: att.description })
  }

  function removeAttachment(index: number) {
    draft.value.attachments.splice(index, 1)
  }

  async function onDrop(files: File[] | null) {
    if (files)
      await uploadAttachments(files)
  }

  const { isOverDropZone } = useDropZone(dropZoneRef, onDrop)

  return {
    isUploading,
    isExceedingAttachmentLimit,
    isOverDropZone,

    failedAttachments,
    dropZoneRef,

    uploadAttachments,
    pickAttachments,
    setDescription,
    removeAttachment,
  }
}
