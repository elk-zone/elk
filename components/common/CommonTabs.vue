<script setup lang="ts">
defineProps<{
  modelValue: string
  options: string[]
}>()
defineEmits(['update:modelValue'])
</script>

<template>
  <div flex w-full>
    <template v-for="option in options" :key="option">
      <input
        :id="`tab-${option}`" :checked="modelValue === option" :value="option" type="radio" name="tabs" display="none" @change="$emit('update:modelValue', option)"
      ><label flex w-full justify-center h-8 cursor-pointer :for="`tab-${option}`" :class="modelValue === option ? 'color-primary' : 'hover:color-purple'" tabindex="1" @keypress.enter="$emit('update:modelValue', option)">{{ option }}</label>
    </template>
  </div>
</template>
