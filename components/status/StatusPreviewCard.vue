<script setup lang="ts">
import type { Card } from 'masto'

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

// TODO: handle card.type: 'photo' | 'video' | 'rich';
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
      <div i-ri:profile-line w="30%" h="30%" text-secondary />
    </div>
    <div
      px3 max-h-2xl
      flex flex-col
      :class="[
        root ? 'flex-gap-1 py1 sm:py3' : 'py1 justify-center sm:justify-start',
      ]"
      my-auto
    >
      <p text-secondary ws-pre-wrap break-all line-clamp-1>
        {{ providerName }}
      </p>
      <strong
        v-if="card.title" font-normal sm:font-medium line-clamp-1
        break-all ws-pre-wrap
      >{{ card.title }}</strong>
      <p
        v-if="card.description"
        line-clamp-1 break-all sm:break-words text-secondary ws-pre-wrap :class="[root ? 'sm:line-clamp-2' : '']"
      >
        {{ card.description }}
      </p>
    </div>
  </NuxtLink>
</template>
