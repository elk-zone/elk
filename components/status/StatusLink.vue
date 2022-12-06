<script setup lang="ts">
import type { Card } from 'masto'

const prop = defineProps<{
  card: Card
}>()
const alt = $computed(() => `${prop.card.title} - ${prop.card.title}`)
</script>

<template>
  <div
    v-if="card"
    border="~ base"
    rounded-lg
    object-cover
    h-full
    w-full
  >
    <NuxtLink :href="card.url">
      <CommonBlurhash
        v-if="card.image"
        :blurhash="card.blurhash"
        class="status-attachment-image"
        :src="card.image"
        :width="card.width"
        :height="card.height"
        :alt="alt"
        rounded-lg
        rounded-b-none
        object-cover
        h-full
        w-full
      />
      <div p2 max-h-2l>
        <p v-if="card.providerName" text-secondary line-clamp-1 text-ellipsis>
          {{ card.providerName }}
        </p>
        <strong v-if="card.title" line-clamp-1 text-ellipsis>{{ card.title }}</strong>
        <p v-if="card.description" text-secondary line-clamp-2 text-ellipsis>
          {{ card.description }}
        </p>
      </div>
    </NuxtLink>
  </div>
</template>
