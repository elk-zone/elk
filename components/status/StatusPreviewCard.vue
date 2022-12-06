<script setup lang="ts">
import type { Card } from 'masto'

const prop = defineProps<{
  card: Card
}>()
const alt = $computed(() => `${prop.card.title} - ${prop.card.title}`)

// TODO: handle card.type: 'photo' | 'video' | 'rich';
</script>

<template>
  <div
    v-if="card"
    border="~ base"
    display-block
    rounded-lg
  >
    <NuxtLink display-block :to="card.url">
      <CommonBlurhash
        v-if="card.image"
        :blurhash="card.blurhash"
        :src="card.image"
        :width="card.width"
        :height="card.height"
        :alt="alt"
        display-block
        rounded-lg
        rounded-b-none
        object-cover
        w-full
      />
      <div p4 max-h-2xl>
        <p v-if="card.providerName" text-secondary line-clamp-1 text-ellipsis>
          {{ card.providerName }}
        </p>
        <strong v-if="card.title" line-clamp-1 text-ellipsis>{{ card.title }}</strong>
        <p v-if="card.description" text-secondary line-clamp-2 text-ellipsis>
          {{ card.description }}
        </p>
        <p v-else text-secondary line-clamp-2 text-ellipsis>
          {{ card.url }}
        </p>
      </div>
    </NuxtLink>
  </div>
</template>
