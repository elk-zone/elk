<script lang="ts" setup>
import type { History } from 'masto'

const {
  history,
} = $defineProps<{
  history: History[]
}>()

const ongoingHot = $computed(() => {
  const h: History[] = []
  for (const item of history) {
    if ((Number(item.uses) || 0) === 0)
      break
    h.push(item)
  }
  return h
})

const people = $computed(() =>
  ongoingHot.reduce((total: number, item) => total + (Number(item.accounts) || 0), 0),
)
const days = $computed(() => ongoingHot.filter(item => !!(Number(item.accounts))).length)
</script>

<template>
  <p>
    {{ $t('command.n-people-in-the-past-n-days', [people, days]) }}
  </p>
</template>
