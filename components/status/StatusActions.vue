<script setup lang="ts">
import type { Status } from 'masto'

const { status } = defineProps<{
  status: Status
}>()

const masto = await useMasto()
const isLoading = ref(false)
async function toggleFavourite() {
  try {
    isLoading.value = true
    if (status.favourited)
      Object.assign(status, await masto.statuses.unfavourite(status.id))
    else
      Object.assign(status, await masto.statuses.favourite(status.id))
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div flex gap-8 :class="isLoading ? 'pointer-events-none' : ''">
    <RouterLink flex gap-1 items-center w-full rounded op75 hover="op100 text-blue" group :to="`/@${status.account.acct}/${status.id}`">
      <div rounded-full p2 group-hover="bg-blue/10">
        <div i-ri:chat-3-line />
      </div>
      <span v-if="status.repliesCount">{{ status.repliesCount }}</span>
    </RouterLink>
    <button flex gap-1 items-center w-full rounded op75 hover="op100 text-green" group>
      <div rounded-full p2 group-hover="bg-green/10">
        <div i-ri:repeat-fill />
      </div>
      <span v-if="status.reblogsCount">{{ status.reblogsCount }}</span>
    </button>
    <button
      flex gap-1 items-center w-full rounded hover="op100 text-rose" group
      :class="status.favourited ? 'text-rose op100' : 'op75'"
      @click="toggleFavourite()"
    >
      <div rounded-full p2 group-hover="bg-rose/10">
        <div :class="status.favourited ? 'i-ri:heart-3-fill' : 'i-ri:heart-3-line'" />
      </div>
      <span v-if="status.favouritesCount">{{ status.favouritesCount }}</span>
    </button>
    <button flex gap-1 items-center w-full rounded op75 hover="op100 text-purple" group>
      <div rounded-full p2 group-hover="bg-purple/10">
        <div i-ri:share-circle-line />
      </div>
    </button>
  </div>
</template>
