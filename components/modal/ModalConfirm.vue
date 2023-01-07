<script setup lang="ts">
import type { ConfirmDialogChoice, ConfirmDialogLabel } from '~/types'

defineProps<ConfirmDialogLabel>()

const emit = defineEmits<{
  (evt: 'choice', choice: ConfirmDialogChoice): void
}>()
</script>

<template>
  <div flex="~ col" gap-6>
    <div font-bold text-lg text-center>
      {{ title }}
    </div>
    <div v-if="description">
      {{ description }}
    </div>
    <div flex justify-end gap-2>
      <button btn-text @click="emit('choice', 'cancel')">
        {{ cancel || $t('common.confirm_dialog.cancel') }}
      </button>
      <button btn-solid @click="emit('choice', 'confirm')">
        {{ confirm || $t('common.confirm_dialog.confirm') }}
      </button>
    </div>
  </div>
</template>
