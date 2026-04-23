<script setup lang="ts">
import type { ConfirmDialogChoice, ConfirmDialogOptions } from '#shared/types'

const { extraOptionType, domainToBlock } = defineProps<ConfirmDialogOptions>()

const emit = defineEmits<{
  (evt: 'choice', choice: ConfirmDialogChoice): void
}>()

const hasDuration = ref(false)
const isValidDuration = ref(true)
const duration = ref(60 * 60) // default to 1 hour
const shouldMuteNotifications = ref(true)
const isMute = computed(() => extraOptionType === 'mute')

const domainInput = ref('')
const isBlockDomain = computed(() => extraOptionType === 'block_domain')
const isDomainConfirmed = computed(() => domainInput.value === domainToBlock)

function handleChoice(choice: ConfirmDialogChoice['choice']) {
  const dialogChoice: ConfirmDialogChoice = {
    choice,
  }

  if (isMute.value) {
    dialogChoice.extraOptions = {
      mute: {
        duration: hasDuration.value ? duration.value : 0,
        notifications: shouldMuteNotifications.value,
      },
    }
  }

  if (isBlockDomain.value) {
    dialogChoice.extraOptions = {
      ...dialogChoice.extraOptions,
      block_domain: {
        confirmed: isDomainConfirmed.value,
      },
    }
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
      <ModalDurationPicker v-if="hasDuration" v-model="duration" v-model:is-valid="isValidDuration" />
      <CommonCheckbox v-model="shouldMuteNotifications" :label="$t('confirm.mute_account.notifications')" prepend-checkbox checked-icon-color="text-primary" />
    </div>

    <div v-if="isBlockDomain" flex-col flex gap-2>
      <label text-sm text-secondary>
        {{ $t('confirm.block_domain.type_to_confirm', [domainToBlock]) }}
      </label>
      <input
        v-model="domainInput"
        type="text"
        :placeholder="domainToBlock"
        class="px-3 py-2 border border-base rounded"
        autocomplete="off"
      >
    </div>

    <div flex justify-end gap-2>
      <button btn-text @click="handleChoice('cancel')">
        {{ cancel || $t('confirm.common.cancel') }}
      </button>
      <button btn-solid :disabled="!isValidDuration || (isBlockDomain && !isDomainConfirmed)" @click="handleChoice('confirm')">
        {{ confirm || $t('confirm.common.confirm') }}
      </button>
    </div>
  </div>
</template>
