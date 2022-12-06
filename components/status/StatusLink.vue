<script setup lang="ts">
import type { Card } from 'masto'

// TODO: needs masto.js PR: https://github.com/neet/masto.js/pull/745
const prop = defineProps<{
  card: Card
}>()
const alt = $computed(() => `${prop.card.title} - ${prop.card.title}`)
</script>

<template>
  <div v-if="card">
    <CommonBlurhash
      :blurhash="card.blurhash"
      class="status-attachment-image"
      :src="card.image"
      :width="card.width"
      :height="card.height"
      :alt="alt"
      border="~ base"
      rounded-lg
      h-full
      w-full
      object-cover
    />
  </div>
</template>
