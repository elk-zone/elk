<script setup lang="ts">
import type { ConfirmDialogLabels } from '~/types'

defineProps<{
  labels: ConfirmDialogLabels
}>()

const emit = defineEmits<{
  (e: 'choice', v: boolean): void
}>()
</script>

<template>
  <div flex="~ col" gap-6>
    <div font-bold text-lg>
      {{ labels.title }}
    </div>
    <div v-if="labels.description">
      {{ labels.description }}
    </div>
    <div flex justify-end gap-2>
      <button btn-text @click="emit('choice', false)">
        {{ labels.cancel }}
      </button>
      <button btn-solid @click="emit('choice', true)">
        {{ labels.confirm }}
      </button>
    </div>
  </div>
</template>
