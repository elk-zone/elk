<script setup lang="ts">
const { options } = defineProps<{
  options: string[] | { name: string; display: string }[]
}>()

const { modelValue } = defineModel<{
  modelValue: string
}>()

const tabs = computed(() => {
  return options.map((option) => {
    if (typeof option === 'string')
      return { name: option, display: option }
    else
      return option
  })
})

function toValidName(otpion: string) {
  return otpion.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-')
}
</script>

<template>
  <div flex w-full items-center lg:text-lg>
    <template v-for="option in tabs" :key="option">
      <input
        :id="`tab-${toValidName(option.name)}`"
        :checked="modelValue === option.name"
        :value="option"
        type="radio"
        name="tabs"
        display="none"
        @change="modelValue = option.name"
      ><label
        flex flex-auto cursor-pointer px3 m1 rounded transition-all
        :for="`tab-${toValidName(option.name)}`"
        tabindex="1"
        hover:bg-active transition-100
        @keypress.enter="modelValue = option.name"
      ><span
        mxa px4 py3 text-center
        :class="modelValue === option.name ? 'font-bold border-b-3 border-primary' : 'op50 hover:op50'"
      >{{ option.display }}</span>
      </label>
    </template>
  </div>
</template>
