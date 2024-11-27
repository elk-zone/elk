<script setup lang="ts">
const model = defineModel<number>()
const isValid = defineModel<boolean>('isValid')

const days = ref<number | ''>(0)
const hours = ref<number | ''>(1)
const minutes = ref<number | ''>(0)

watchEffect(() => {
  if (days.value === '' || hours.value === '' || minutes.value === '') {
    isValid.value = false
    return
  }

  const duration
      = days.value * 24 * 60 * 60
      + hours.value * 60 * 60
      + minutes.value * 60

  if (duration <= 0) {
    isValid.value = false
    return
  }

  isValid.value = true
  model.value = duration
})
</script>

<template>
  <div flex flex-grow-0 gap-2>
    <label flex items-center gap-2>
      <input v-model="days" type="number" min="0" max="1999" input-base :class="!isValid ? 'input-error' : null">
      {{ $t('confirm.mute_account.days', days === '' ? 0 : days) }}
    </label>
    <label flex items-center gap-2>
      <input v-model="hours" type="number" min="0" max="24" input-base :class="!isValid ? 'input-error' : null">
      {{ $t('confirm.mute_account.hours', hours === '' ? 0 : hours) }}
    </label>
    <label flex items-center gap-2>
      <input v-model="minutes" type="number" min="0" max="59" step="5" input-base :class="!isValid ? 'input-error' : null">
      {{ $t('confirm.mute_account.minute', minutes === '' ? 0 : minutes) }}
    </label>
  </div>
</template>
