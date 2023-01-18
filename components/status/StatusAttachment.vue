<script setup lang="ts">
import { clamp } from '@vueuse/core'
import type { mastodon } from 'masto'

const {
  attachment,
  fullSize = false,
} = defineProps<{
  attachment: mastodon.v1.MediaAttachment
  attachments?: mastodon.v1.MediaAttachment[]
  fullSize?: boolean
}>()

const src = $computed(() => attachment.previewUrl || attachment.url || attachment.remoteUrl!)
const srcset = $computed(() => [
  [attachment.url, attachment.meta?.original?.width],
  [attachment.remoteUrl, attachment.meta?.original?.width],
  [attachment.previewUrl, attachment.meta?.small?.width],
].filter(([url]) => url).map(([url, size]) => `${url} ${size}w`).join(', '))

const rawAspectRatio = computed(() => {
  if (attachment.meta?.original?.aspect)
    return attachment.meta.original.aspect
  if (attachment.meta?.small?.aspect)
    return attachment.meta.small.aspect
  return undefined
})

const aspectRatio = computed(() => {
  if (fullSize)
    return rawAspectRatio.value
  if (rawAspectRatio.value)
    return clamp(rawAspectRatio.value, 0.8, 6)
  return undefined
})

const objectPosition = computed(() => {
  const focusX = attachment.meta?.focus?.x || 0
  const focusY = attachment.meta?.focus?.y || 0
  const x = ((focusX / 2) + 0.5) * 100
  const y = ((focusY / -2) + 0.5) * 100

  return `${x}% ${y}%`
})

const typeExtsMap = {
  video: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv', 'mpg', 'mpeg'],
  audio: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'],
  image: ['jpg', 'jpeg', 'png', 'svg', 'webp', 'bmp'],
  gifv: ['gifv', 'gif'],
}

const type = $computed(() => {
  if (attachment.type && attachment.type !== 'unknown')
    return attachment.type
  // some server returns unknown type, we need to guess it based on file extension
  for (const [type, exts] of Object.entries(typeExtsMap)) {
    if (exts.some(ext => src?.toLowerCase().endsWith(`.${ext}`)))
      return type
  }
  return 'unknown'
})

const vnode = $computed(() => {
  // Vnode for creating clickable links in Image Alt description (see #1267)

  if (!attachment.description)
    return null

  let description = String(attachment.description)

  // Transform Markdown links into anchor tags
  // https://stackoverflow.com/a/37462442
  // https://stephencharlesweiss.com/regex-markdown-link
  const regexMarkdownFind = /(?:__|[*#])|\[(.*?)\]\(.*?\)/g
  const regexMarkdownExtract = /!?\[([^\]]*)?\]\(((https?:\/\/)?[A-Za-z0-9\:\/\. ]+)(\"(.+)\")?\)/gm

  let matches = [...description.matchAll(regexMarkdownFind)]

  matches.forEach((match) => {
    const extracted = [...match[0].matchAll(regexMarkdownExtract)][0]

    // regexMarkdownFind has false positives sometimes. If the match can't
    // be extracted, let's skip it.
    if (!extracted)
      return

    const anchor = `<a href="${extracted[2]}">${extracted[1]}</a>`

    description = description.replaceAll(extracted[0], anchor)
  })

  // Transform URLs into anchor tags
  // https://stackoverflow.com/a/3809435
  const regexUrlFind = /\shttps?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

  matches = [...description.matchAll(regexUrlFind)]

  for (const match in matches) {
    let url = matches[match][0].trim()

    if (url.slice(-1) === '.')
      url = url.slice(0, -1)

    const anchor = `<a href="${url}">${url}</a>`

    description = description.replaceAll(url, anchor)
  }

  const vnode = contentToVNode(description, {
    emojis: undefined,
    replaceUnicodeEmoji: false,

    mentions: undefined,
    collapseMentionLink: false,
    convertMentionLink: false,

    markdown: true,
  })
  return vnode
})

const video = ref<HTMLVideoElement | undefined>()
const prefersReducedMotion = usePreferredReducedMotion()
const isAudio = $computed(() => attachment.type === 'audio')

useIntersectionObserver(video, (entries) => {
  const ready = video.value?.dataset.ready === 'true'
  if (prefersReducedMotion.value === 'reduce') {
    if (ready && !video.value?.paused)
      video.value?.pause()

    return
  }

  entries.forEach((entry) => {
    if (entry.intersectionRatio <= 0.75) {
      ready && !video.value?.paused && video.value?.pause()
    }
    else {
      video.value?.play().then(() => {
        video.value!.dataset.ready = 'true'
      }).catch(noop)
    }
  })
}, { threshold: 0.75 })
</script>

<template>
  <div relative ma flex :gap="isAudio ? '2' : ''">
    <template v-if="type === 'video'">
      <video
        ref="video"
        preload="none"
        :poster="attachment.previewUrl"
        muted
        loop
        playsinline
        controls
        rounded-lg
        object-cover
        :width="attachment.meta?.original?.width"
        :height="attachment.meta?.original?.height"
        :style="{
          aspectRatio,
          objectPosition,
        }"
      >
        <source :src="attachment.url || attachment.previewUrl" type="video/mp4">
      </video>
    </template>
    <template v-else-if="type === 'gifv'">
      <video
        ref="video"
        preload="none"
        :poster="attachment.previewUrl"
        muted
        loop
        playsinline
        rounded-lg
        object-cover
        :width="attachment.meta?.original?.width"
        :height="attachment.meta?.original?.height"
        :style="{
          aspectRatio,
          objectPosition,
        }"
      >
        <source :src="attachment.url || attachment.previewUrl" type="video/mp4">
      </video>
    </template>
    <template v-else-if="type === 'audio'">
      <audio controls h-15>
        <source :src="attachment.url || attachment.previewUrl" type="audio/mp3">
      </audio>
    </template>
    <template v-else>
      <button
        type="button"
        focus:outline-none
        focus:ring="2 primary inset"
        rounded-lg
        h-full
        w-full
        aria-label="Open image preview dialog"
        @click="openMediaPreview(attachments ? attachments : [attachment], attachments?.indexOf(attachment) || 0)"
      >
        <CommonBlurhash
          :blurhash="attachment.blurhash"
          class="status-attachment-image"
          :src="src"
          :srcset="srcset"
          :width="attachment.meta?.original?.width"
          :height="attachment.meta?.original?.height"
          :alt="attachment.description ?? 'Image'"
          :style="{
            aspectRatio,
            objectPosition,
          }"
          rounded-lg
          h-full
          w-full
          object-cover
        />
      </button>
    </template>
    <div v-if="attachment.description" :class="isAudio ? '' : 'absolute left-2 bottom-2'">
      <VDropdown :distance="6" placement="bottom-start">
        <button
          font-bold text-sm
          :class="isAudio
            ? 'rounded-full h-15 w-15 btn-outline border-base text-secondary hover:bg-active hover:text-active'
            : 'rounded-1 bg-black/65 text-white hover:bg-black px1.2 py0.2'"
        >
          <div hidden>
            read {{ attachment.type }} description
          </div>
          ALT
        </button>
        <template #popper>
          <div p4 flex flex-col gap-2 max-w-130>
            <div flex justify-between>
              <h2 font-bold text-xl text-secondary>
                {{ $t('status.img_alt.desc') }}
              </h2>
              <button v-close-popper text-sm btn-outline py0 px2 text-secondary border-base>
                {{ $t('status.img_alt.dismiss') }}
              </button>
            </div>
            <p class="content-rich line-compact" whitespace-pre-wrap>
              <component :is="vnode" />
            </p>
          </div>
        </template>
      </VDropdown>
    </div>
  </div>
</template>
