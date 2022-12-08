<script setup lang="ts">
import type { Card } from 'masto'

const prop = defineProps<{
  card: Card
}>()
const alt = $computed(() => `${prop.card.title} - ${prop.card.title}`)
const isSquare = $computed(() => prop.card.width === prop.card.height)
const url = new URL(prop.card.url)
const description = $computed(() => prop.card.description ? prop.card.description : url.hostname)

// TODO: handle card.type: 'photo' | 'video' | 'rich';
</script>

<template>
  <div
    v-if="card"
    border="~ base"
    display-block
    rounded-lg
  >
    <NuxtLink display-block :to="card.url" :class="{ flex: isSquare }">
      <CommonBlurhash
        v-if="card.image"
        :blurhash="card.blurhash"
        :src="card.image"
        :width="card.width"
        :height="card.height"
        :alt="alt"
        flex flex-col
        display-block
        rounded-lg
        :class="isSquare ? 'rounded-r-none w-32' : 'rounded-b-none w-full'"
        object-cover
      />
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
  </div>
</template>
