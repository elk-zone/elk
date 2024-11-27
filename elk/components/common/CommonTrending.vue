<script setup lang="ts">
import type { akkoma } from 'akko'

const {
  history,
  maxDay = 2,
} = defineProps<{
  history: akkoma.v1.TagHistory[]
  maxDay?: number
}>()

const ongoingHot = computed(() => history.slice(0, maxDay))

const people = computed(() =>
  ongoingHot.value.reduce((total: number, item) => total + (Number(item.accounts) || 0), 0),
)
</script>

<template>
  <p>
    {{ $t('command.n_people_in_the_past_n_days', [people, maxDay]) }}
  </p>
</template>
