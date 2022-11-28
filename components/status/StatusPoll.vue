<script setup lang="ts">
import type { Poll } from 'masto'

const props = defineProps<{
  poll: Poll
}>()

function toPercentage(num: number) {
  const percentage = 100 * num
  return `${percentage.toFixed(1).replace(/\.?0+$/, '')}%`
}
const expiredTimeAgo = useTimeAgo(props.poll.expiresAt!)
</script>

<template>
  <div flex flex-col w-full items-stretch gap-3>
    <div v-for="(option, index) of poll.options" :key="option.title" flex justify-between p-1 relative :style="{ '--bar-width': toPercentage((option.votesCount || 0) / poll.votesCount) }">
      <div absolute top-0 left-0 bottom-0 bg-primary-active rounded-lg h-full class="w-[var(--bar-width)]" />
      <div z-1 flex items-center gap-1 px-1>
        <div>
          {{ option.title }}
        </div>
        <div v-if="poll.voted && poll.ownVotes?.includes(index)">
          <div i-ri:checkbox-circle-line />
        </div>
      </div>
      <div z-1>
        {{ toPercentage((option.votesCount || 0) / poll.votesCount) }}
      </div>
    </div>
    <div text-sm>
      {{ poll.votersCount }} votes &middot; {{ poll.expired ? 'finished' : 'ends' }}  {{ expiredTimeAgo }}
    </div>
  </div>
</template>
