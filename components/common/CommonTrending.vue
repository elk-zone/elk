<script lang="ts" setup>
import type { History } from 'masto'

const {
  history,
  maxDay = 2,
} = $defineProps<{
  history: History[]
  maxDay?: number
}>()

const ongoingHot = $computed(() => history.slice(0, maxDay))

const people = $computed(() =>
  ongoingHot.reduce((total: number, item) => total + (Number(item.accounts) || 0), 0),
)
</script>

<template>
  <p>
    {{ $t('command.n-people-in-the-past-n-days', [people, maxDay]) }}
  </p>
</template>
