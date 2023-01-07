<script setup lang="ts">
import type { Card, CardType } from 'masto'

const props = defineProps<{
  card: Card
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

const gitHubCards = $(useFeatureFlag('experimentalGitHubCards'))

// checks if title contains a username
const usernames = props.card.title.match(/@+[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/gi)
const isMastodonLink = usernames?.length === 1 && props.card.type === 'link'
const username = isMastodonLink ? usernames[0] : ''

// TODO: handle card.type: 'photo' | 'video' | 'rich';
const cardTypeIconMap: Record<CardType, string> = {
  link: 'i-ri:profile-line',
  photo: 'i-ri:image-line',
  video: 'i-ri:play-line',
  rich: 'i-ri:profile-line',
}
</script>

<template>
  <StatusPreviewGitHub v-if="gitHubCards && providerName === 'GitHub'" :card="card" />
  <StatusPreviewMastodon v-else-if="isMastodonLink" :card="card" />
  <NuxtLink
    v-else
    block
    of-hidden
    hover:bg-active
    :to="card.url"
    :class="{
      'flex': isSquare,
      'p-4': root,
      'rounded-lg border border-base': !root,
    }"
    target="_blank"
  >
    <div
      v-if="card.image"
      flex flex-col
      display-block of-hidden
      border="base"
      :class="{
        'sm:(min-w-32 w-32 h-32) min-w-22 w-22 h-22 border-r': isSquare,
        'w-full aspect-[1.91] border-b': !isSquare,
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
      min-w-22 w-22 h-22 sm="min-w-32 w-32 h-32" bg="slate-500/10" flex justify-center items-center
      :class="[
        root ? 'rounded-lg' : '',
      ]"
    >
      <div :class="cardTypeIconMap[card.type]" w="30%" h="30%" text-secondary />
    </div>
    <StatusPreviewCardInfo :root="root" :card="card" :provider="providerName" :is-square="isSquare" />
  </NuxtLink>
</template>
