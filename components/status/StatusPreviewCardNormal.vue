<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  card: mastodon.v1.PreviewCard
  /** For the preview image, only the small image mode is displayed */
  smallPictureOnly?: boolean
  /** When it is root card in the list, not appear as a child card */
  root?: boolean
}>()

// mastodon's default max og image width
const ogImageWidth = 400

const alt = $computed(() => `${props.card.title} - ${props.card.title}`)
const isSquare = $computed(() => (
  props.smallPictureOnly
  || props.card.width === props.card.height
  || Number(props.card.width || 0) < ogImageWidth
  || Number(props.card.height || 0) < ogImageWidth / 2
))
const providerName = $computed(() => props.card.providerName ? props.card.providerName : new URL(props.card.url).hostname)

// TODO: handle card.type: 'photo' | 'video' | 'rich';
const cardTypeIconMap: Record<mastodon.v1.PreviewCardType, string> = {
  link: 'i-ri:profile-line',
  photo: 'i-ri:image-line',
  video: 'i-ri:play-line',
  rich: 'i-ri:profile-line',
}
</script>

<template>
  <NuxtLink
    block
    of-hidden
    :to="card.url"
    bg-card
    hover:bg-active
    :class="{
      'flex': isSquare,
      'p-4': root,
      'rounded-lg': !root,
    }"
    target="_blank"
    external
  >
    <div
      v-if="card.image"
      flex flex-col
      display-block of-hidden
      :class="{
        'sm:(min-w-32 w-32 h-32) min-w-24 w-24 h-24': isSquare,
        'w-full aspect-[1.91]': !isSquare,
        'rounded-lg': root,
      }"
    >
      <CommonBlurhash
        :blurhash="card.blurhash"
        :src="card.image"
        :width="card.width"
        :height="card.height"
        :alt="alt"
        w-full h-full object-cover
      />
    </div>
    <div
      v-else
      min-w-24 w-24 h-24 sm="min-w-32 w-32 h-32" bg="slate-500/10" flex justify-center items-center
      :class="[
        root ? 'rounded-lg' : '',
      ]"
    >
      <div :class="cardTypeIconMap[card.type]" w="30%" h="30%" text-secondary />
    </div>
    <StatusPreviewCardInfo :p="isSquare ? 'x-4' : '4'" :root="root" :card="card" :provider="providerName" />
  </NuxtLink>
</template>
