<script setup lang="ts">
import type { Card } from 'masto'

const props = defineProps<{
  card: Card
  /** For the preview image, only the small image mode is displayed */
  smallPictureOnly?: boolean
  /** When it is root card in the list, not appear as a child card */
  root?: boolean
}>()
const alt = $computed(() => `${props.card.title} - ${props.card.title}`)
const isSquare = $computed(() => props.smallPictureOnly || props.card.width === props.card.height)
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
    <div v-else min-w-22 w-22 h-22 sm="min-w-32 w-32 h-32" bg="slate-500/10" flex justify-center items-center>
      <div i-ri:profile-line w="30%" h="30%" text-secondary />
    </div>
    <div
      px4 max-h-2xl
      flex flex-col justify-center
      :class="{
        py4: !root,
      }"
    >
      <p text-secondary line-clamp-1 ws-pre-wrap break-all>
        {{ providerName }}
      </p>
      <strong v-if="card.title" line-clamp-1 ws-pre-wrap break-all>{{ card.title }}</strong>
      <p
        v-if="card.description"
        text-secondary ws-pre-wrap break-words
        :class="{
          'line-clamp-1 sm:line-clamp-2 ': root,
          'hidden sm:line-clamp-2': !root,
        }"
      >
        {{ card.description }}
      </p>
    </div>
  </NuxtLink>
</template>
