<script setup lang="ts">
import type { mastodon } from 'masto'

const { card, smallPictureOnly } = defineProps<{
  card: mastodon.v1.PreviewCard
  /** For the preview image, only the small image mode is displayed */
  smallPictureOnly?: boolean
  /** When it is root card in the list, not appear as a child card */
  root?: boolean
}>()

// mastodon's default max og image width
const ogImageWidth = 400

const alt = computed(() => `${card.title} - ${card.title}`)
const isSquare = computed(() => (
  smallPictureOnly
  || card.width === card.height
  || Number(card.width || 0) < ogImageWidth
  || Number(card.height || 0) < ogImageWidth / 2
))
const providerName = computed(() => card.providerName ? card.providerName : new URL(card.url).hostname)

// TODO: handle card.type: 'photo' | 'video' | 'rich';
const cardTypeIconMap: Record<mastodon.v1.PreviewCardType, string> = {
  link: 'i-ri:profile-line',
  photo: 'i-ri:image-line',
  video: 'i-ri:play-line',
  rich: 'i-ri:profile-line',
}

const userSettings = useUserSettings()
const shouldLoadAttachment = ref(!getPreferences(userSettings.value, 'enableDataSaving'))

function loadAttachment() {
  shouldLoadAttachment.value = true
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
      'flex flex-col': isSquare,
      'p-4': root,
      'rounded-lg': !root,
    }"
    target="_blank"
    external
  >
    <div :class="isSquare ? 'flex' : ''">
      <!-- image -->
      <div
        v-if="card.image"
        flex flex-col
        display-block of-hidden
        :class="{
          'sm:(min-w-32 w-32 h-32) min-w-24 w-24 h-24': isSquare,
          'w-full aspect-[1.91]': !isSquare,
          'rounded-lg': root,
        }"
        relative
      >
        <CommonBlurhash
          :blurhash="card.blurhash"
          :src="card.image"
          :width="card.width"
          :height="card.height"
          :alt="alt"
          :should-load-image="shouldLoadAttachment"
          w-full h-full object-cover
          :class="!shouldLoadAttachment ? 'brightness-60' : ''"
        />
        <button
          v-if="!shouldLoadAttachment"
          type="button"
          absolute
          class="status-preview-card-load bg-black/64"
          p-2
          transition
          rounded
          hover:bg-black
          cursor-pointer
          @click.stop.prevent="!shouldLoadAttachment ? loadAttachment() : null"
        >
          <span
            text-sm
            text-white
            flex flex-col justify-center items-center
            gap-3 w-6 h-6
            i-ri:file-download-line
          />
        </button>
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
      <!-- description -->
      <StatusPreviewCardInfo :p="isSquare ? 'x-4' : '4'" :root="root" :card="card" :provider="providerName" />
    </div>
    <StatusPreviewCardMoreFromAuthor
      v-if="card?.authors?.[0]?.account"
      :account="card.authors[0].account"
    />
  </NuxtLink>
</template>

<style lang="postcss">
.status-preview-card-load {
  left: 50%;
  top: 50%;
  translate: -50% -50%;
}
</style>
