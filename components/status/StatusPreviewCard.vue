<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  card: mastodon.v1.PreviewCard
  /** For the preview image, only the small image mode is displayed */
  smallPictureOnly?: boolean
  /** When it is root card in the list, not appear as a child card */
  root?: boolean
  /** Defined when the preview card URL matches the last shared link href attribute */
  cleanSharedLink?: string | false
}>()

const providerName = $computed(() => props.card.providerName ? props.card.providerName : new URL(props.card.url).hostname)
const gitHubCards = $(usePreferences('experimentalGitHubCards'))
</script>

<template>
  <LazyStatusPreviewGitHub v-if="gitHubCards && providerName === 'GitHub'" :card="card" />
  <LazyStatusPreviewStackBlitz v-else-if="gitHubCards && providerName === 'StackBlitz'" :card="card" :small-picture-only="smallPictureOnly" :root="root" />
  <StatusPreviewCardNormal v-else :card="card" :clean-shared-link="cleanSharedLink" :small-picture-only="smallPictureOnly" :root="root" />
</template>
