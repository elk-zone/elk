<script lang="ts" setup>
import type { History } from 'masto'

const {
  history,
} = $defineProps<{
  history: History[]
}>()

const people = $computed(() =>
  history.reduce((total: number, item) => total + (Number(item.accounts) || 0), 0),
)
const days = $computed(() => history.filter(item => !!(Number(item.accounts))).length)
</script>

<template>
  <p>
    {{ people }} people in the past {{ days }} days
  </p>
</template>
