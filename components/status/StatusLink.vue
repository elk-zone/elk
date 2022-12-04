<script setup lang="ts">
import type { Card } from 'masto'

// TODO: needs masto.js PR: https://github.com/neet/masto.js/pull/745
defineProps<{
  card: Card
}>()

// // mock data
// const card: Card = {
//   url: 'https://github.com/vitejs/vite/pull/11158',
//   title: 'refactor: move framework plugins out of core by patak-dev · Pull Request #11158 · vitejs/vite',
//   description: 'Description\nBenefits of Framework plugins being out of Core\nFoster ownership of the plugin from folks out of the Core team\nThe framework plugins in the core monorepo doesn\'t help to encourage colla...',
//   type: 'link',
//   authorName: '',
//   authorUrl: '',
//   providerName: 'GitHub',
//   providerUrl: '',
//   html: '',
//   width: '400', // should be number
//   height: '200', // should be number
//   image: 'https://cdn.fosstodon.org/cache/preview_cards/images/012/447/272/original/f226ed69b0e5ff34.png',
//   embedUrl: '',
//   blurhash: 'UNR:HHR-oItR%1xtR-s:R:o#adR+~padR-Ri',
// }
</script>

<template>
  <div v-if="card">
    <img :src="card.image || ''" :alt="card.title">
  </div>
</template>
