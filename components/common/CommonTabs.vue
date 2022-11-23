<script setup lang="ts">
defineProps<{
  options: string[]
}>()

const { modelValue } = defineModel<{
  modelValue: string
}>()

function toValidName(otpion: string) {
  return otpion.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
}
</script>

<template>
  <div flex w-full text-lg>
    <template v-for="option in options" :key="option">
      <input
        :id="`tab-${toValidName(option)}`"
        :checked="modelValue === option"
        :value="option"
        type="radio"
        name="tabs"
        display="none"
        @change="modelValue = option"
      ><label
        flex flex-1 cursor-pointer p3 m1 rounded transition-all
        :for="`tab-${toValidName(option)}`"
        tabindex="1"
        hover:bg-active
        @keypress.enter="modelValue = option"
      ><span
        mxa px2
        :class="modelValue === option ? 'font-bold border-b-3 border-primary' : 'op50 hover:op50'"
      >{{ option }}</span>
      </label>
    </template>
  </div>
</template>
