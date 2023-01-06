<script setup lang="ts">
import { confirmDialogChoice, confirmDialogLabels, isConfirmDialogOpen } from '~/composables/dialog'

const choose = (choice: boolean) => {
  confirmDialogChoice.value = choice
  isConfirmDialogOpen.value = false
}
</script>

<template>
  <div flex="~ col" gap-6>
    <div font-bold text-lg>
      {{ confirmDialogLabels?.title }}
    </div>
    <div v-if="confirmDialogLabels?.description">
      {{ confirmDialogLabels.description }}
    </div>
    <div flex justify-end gap-2>
      <button btn-text @click="choose(false)">
        {{ confirmDialogLabels?.no }}
      </button>
      <button btn-solid @click="choose(true)">
        {{ confirmDialogLabels?.yes }}
      </button>
    </div>
  </div>
</template>
