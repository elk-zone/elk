<script setup lang="ts">
import type { ConfirmDialogChoice, ConfirmDialogOptions } from '~/types'

const props = defineProps<ConfirmDialogOptions>()

const emit = defineEmits<{
  (evt: 'choice', choice: ConfirmDialogChoice): void
}>()

const hasDuration = ref(false)
const isValidDuration = ref(true)
const duration = ref(60 * 60) // default to 1 hour
const shouldMuteNotifications = ref(true)
const isMute = computed(() => props.extraOptionType === 'mute')

function handleChoice(choice: ConfirmDialogChoice['choice']) {
  const dialogChoice = {
    choice,
    ...isMute.value && {
      extraOptions: {
        mute: {
          duration: hasDuration.value ? duration.value : 0,
          notifications: shouldMuteNotifications.value,
        },
      },
    },
  }

  emit('choice', dialogChoice)
}
</script>

<template>
  <div flex="~ col" gap-6>
    <div font-bold text-lg>
      {{ title }}
    </div>
    <div v-if="description">
      {{ description }}
    </div>
    <div v-if="isMute" flex-col flex gap-4>
      <CommonCheckbox v-model="hasDuration" :label="$t('confirm.mute_account.specify_duration')" prepend-checkbox checked-icon-color="text-primary" />
      <DurationPicker v-if="hasDuration" v-model="duration" v-model:is-valid="isValidDuration" />
      <CommonCheckbox v-model="shouldMuteNotifications" :label="$t('confirm.mute_account.notifications')" prepend-checkbox checked-icon-color="text-primary" />
    </div>

    <div flex justify-end gap-2>
      <button btn-text @click="handleChoice('cancel')">
        {{ cancel || $t('confirm.common.cancel') }}
      </button>
      <button btn-solid :disabled="!isValidDuration" @click="handleChoice('confirm')">
        {{ confirm || $t('confirm.common.confirm') }}
      </button>
    </div>
  </div>
</template>
