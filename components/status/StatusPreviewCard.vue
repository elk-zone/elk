<script setup lang="ts">
import type { mastodon } from 'masto'

const props = defineProps<{
  status?: mastodon.v1.Status
  card: mastodon.v1.PreviewCard
  /** For the preview image, only the small image mode is displayed */
  smallPictureOnly?: boolean
  /** When it is root card in the list, not appear as a child card */
  root?: boolean
  linkToStatus?: URL
}>()

const providerName = $computed(() => props.card.providerName ? props.card.providerName : new URL(props.card.url).hostname)

const gitHubCards = $(usePreferences('experimentalGitHubCards'))
</script>

<template>
  <StatusPreviewMastodon v-if="linkToStatus" :link-to-status="linkToStatus" :source-status="status" :card="card" />
  <LazyStatusPreviewGitHub v-else-if="gitHubCards && providerName.toLowerCase().includes('github')" :card="card" />
  <LazyStatusPreviewStackBlitz v-else-if="gitHubCards && providerName.toLowerCase().includes('stackblitz')" :card="card" :small-picture-only="smallPictureOnly" :root="root" />
  <StatusPreviewCardNormal v-else :card="card" :small-picture-only="smallPictureOnly" :root="root" />
</template>
