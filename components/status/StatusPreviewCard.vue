<script setup lang="ts">
import type { Card } from 'masto'

const props = defineProps<{
  card: Card
  /** For the preview image, only the small image mode is displayed */
  smallPictureOnly?: boolean
  /** When it is root card in the list, not appear as a child card */
  root?: boolean
}>()
const cardImage = computed(() => props.card.image)
const alt = $computed(() => `${props.card.title} - ${props.card.title}`)
const isSquare = $computed(() => props.smallPictureOnly || props.card.width === props.card.height)
const providerName = $computed(() => props.card.providerName ? props.card.providerName : new URL(props.card.url).hostname)
const imageSrc = ref<string | null>()

// TODO: handle card.type: 'photo' | 'video' | 'rich';

// Only try to fetch og:image if the card.image is already provided from mastodon
// We only want to improve the image quality
watch(cardImage, (image) => {
  imageSrc.value = image

  if (image) {
    $fetch<string>('/api/og-image', {
      params: { cardUrl: props.card.url },
    }).then((ogImageUrl) => {
      // eslint-disable-next-line no-console
      console.log('ogImageUrl', ogImageUrl)

      // Only override if ogImageUrl is not empty
      if (ogImageUrl)
        imageSrc.value = ogImageUrl
    }).catch(() => {})
  }
}, { immediate: true })
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
      v-if="imageSrc"
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
        :src="imageSrc"
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
        root ? 'flex-gap-1 py1 sm:py3' : 'py3  justify-center sm:justify-start',
      ]"
    >
      <p
        text-secondary ws-pre-wrap break-all
        :class="[
          !card.description || root
            ? 'line-clamp-1'
            : 'hidden sm:line-clamp-1',
        ]"
      >
        {{ providerName }}
      </p>
      <strong
        v-if="card.title" font-normal sm:font-medium line-clamp-1
        break-all ws-pre-wrap
      >{{ card.title }}</strong>
      <p
        v-if="card.description"
        line-clamp-1 break-all sm:line-clamp-2 sm:break-words text-secondary ws-pre-wrap
      >
        {{ card.description }}
      </p>
    </div>
  </NuxtLink>
</template>
