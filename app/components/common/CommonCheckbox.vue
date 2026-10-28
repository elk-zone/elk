<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean | null
  label?: string
  hover?: boolean
  iconChecked?: string
  iconUnchecked?: string
  checkedIconColor?: string
  prependCheckbox?: boolean
}>()
defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()
const checked = useModel(props, 'modelValue', {
  get: value => !!value,
  set: (value: boolean) => value,
})
</script>

<template>
  <label
    class="common-checkbox flex items-center cursor-pointer py-1 text-size-base w-full gap-y-1"
    :class="hover ? 'hover:bg-active ms--2 px-4 py-2' : null"
    v-bind="$attrs"
    @click.prevent="checked = !checked"
  >
    <span v-if="label && !prependCheckbox" flex-1 ms-2 pointer-events-none>{{ label }}</span>
    <span
      :class="[
        checked ? (iconChecked ?? 'i-ri:checkbox-line') : (iconUnchecked ?? 'i-ri:checkbox-blank-line'),
        checked && checkedIconColor,
      ]"
      text-lg
      aria-hidden="true"
    />
    <input
      v-model="checked"
      type="checkbox"
      sr-only
    >
    <span v-if="label && prependCheckbox" flex-1 ms-2 pointer-events-none>{{ label }}</span>
  </label>
</template>

<style>
.common-checkbox:focus-within {
  outline: none;
  border-bottom: 1px solid var(--c-text-base);
}
</style>
