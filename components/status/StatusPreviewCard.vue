<script setup lang="ts">
import type { Card } from 'masto'

const props = defineProps<{
  card: Card
  /** For the preview image, only the small image mode is displayed */
  smallPictureOnly?: boolean
  /** When it is root card in the list, not appear as a child card */
  root?: boolean
}>()
const image = ref(props.card.image)
const alt = $computed(() => `${props.card.title} - ${props.card.title}`)
const isSquare = $computed(() => props.smallPictureOnly || props.card.width === props.card.height)
const description = $computed(() => props.card.description ? props.card.description : new URL(props.card.url).hostname)

// TODO: handle card.type: 'photo' | 'video' | 'rich';

// Only try to fetch og:image if the card.image is already provided from mastodon
// We only want to improve the image quality
if (image.value) {
  $fetch<string>('/api/og-image', {
    params: { cardUrl: props.card.url },
  }).then((ogImageUrl) => {
    // Only override if ogImageUrl is not empty
    if (ogImageUrl)
      image.value = ogImageUrl
  }).catch(() => {})
}
</script>

<template>
  <NuxtLink
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
      v-if="image"
      flex flex-col
      display-block of-hidden

      border="base"
      :class="{
        'min-w-32 w-32 h-32 border-r': isSquare,
        'w-full aspect-[1.91] border-b': !isSquare,
        'rounded-lg': root,
      }"
    >
      <CommonBlurhash
        :blurhash="card.blurhash"
        :src="image"
        :width="card.width"
        :height="card.height"
        :alt="alt"
        w-full h-full object-cover
      />
    </div>
    <div v-else min-w-32 w-32 h-32 bg="slate-500/10" flex justify-center items-center>
      <div i-ri:profile-line w="30%" h="30%" text-secondary />
    </div>
    <div
      p4 max-h-2xl
      flex flex-col
    >
      <p v-if="card.providerName" text-secondary line-clamp-1 text-ellipsis>
        {{ card.providerName }}
      </p>
      <strong v-if="card.title" line-clamp-1 text-ellipsis>{{ card.title }}</strong>
      <p v-if="description" text-secondary line-clamp-2 text-ellipsis>
        {{ description }}
      </p>
    </div>
  </NuxtLink>
</template>
