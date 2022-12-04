<script setup lang="ts">
import type { Poll } from 'masto'

const { poll: _poll } = defineProps<{
  poll: Poll
}>()
const poll = reactive({ ..._poll })

function toPercentage(num: number) {
  const percentage = 100 * num
  return `${percentage.toFixed(1).replace(/\.?0+$/, '')}%`
}
const timeAgoOptions = useTimeAgoOptions()
const expiredTimeAgo = useTimeAgo(poll.expiresAt!, timeAgoOptions)

const masto = useMasto()
async function vote(e: Event) {
  const formData = new FormData(e.target as HTMLFormElement)
  const choices = formData.getAll('choices') as string[]
  await masto.poll.vote(poll.id, { choices })

  // Update the poll optimistically
  for (const [index, option] of poll.options.entries()) {
    if (choices.includes(String(index)))
      option.votesCount = (option.votesCount || 0) + 1
  }
  poll.voted = true
  poll.votesCount++
  poll.votersCount = (poll.votersCount || 0) + 1
}
</script>

<template>
  <div flex flex-col w-full items-stretch gap-3>
    <form v-if="!poll.voted && !poll.expired" flex flex-col gap-4 accent-primary @click.stop="noop" @submit.prevent="vote">
      <label v-for="(option, index) of poll.options" :key="index" flex items-center gap-2 px-2>
        <input name="choices" :value="index" :type="poll.multiple ? 'checkbox' : 'radio'">
        {{ option.title }}
      </label>
      <button btn-solid>
        {{ $t('action.vote') }}
      </button>
    </form>
    <template v-else>
      <div v-for="(option, index) of poll.options" :key="index" py-1 relative :style="{ '--bar-width': toPercentage((option.votesCount || 0) / poll.votesCount) }">
        <div flex justify-between pb-2 w-full>
          <span inline-flex align-items>
            {{ option.title }}
            <span v-if="poll.voted && poll.ownVotes?.includes(index)" ml-2 mt-1 inline-block i-ri:checkbox-circle-line />
          </span>
          <span text-primary-active> {{ poll.votesCount ? toPercentage((option.votesCount || 0) / (poll.votesCount)) : '0%' }}</span>
        </div>
        <div class="bg-gray/40" rounded-l-sm rounded-r-lg h-5px w-full>
          <div bg-primary-active h-full class="w-[var(--bar-width)]" />
        </div>
      </div>
    </template>
    <div text-sm>
      {{ $t('status.poll.count', [poll.votersCount]) }}
      &middot;
      {{ $t(poll.expired ? 'status.poll.finished' : 'status.poll.ends', [expiredTimeAgo]) }}
    </div>
  </div>
</template>
