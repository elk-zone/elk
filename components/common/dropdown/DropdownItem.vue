<script setup lang="ts">
const props = withDefaults(defineProps<{
  is?: string
  text?: string
  description?: string
  icon?: string
  checked?: boolean
  command?: boolean
}>(), {
  is: 'div',
})
const emit = defineEmits(['click'])

const { hide } = useDropdownContext() || {}

const el = ref<HTMLDivElement>()

const handleClick = (evt: MouseEvent) => {
  hide?.()
  emit('click', evt)
}

useCommand({
  scope: 'Actions',

  order: -1,
  visible: () => props.command && props.text,

  name: () => props.text!,
  icon: () => props.icon ?? 'i-ri:question-line',
  description: () => props.description,

  onActivate() {
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    el.value?.dispatchEvent(clickEvent)
  },
})
</script>

<template>
  <component
    v-bind="$attrs"
    :is="is"
    ref="el"
    w-full
    flex gap-3 items-center cursor-pointer px4 py3
    select-none
    hover-bg-active
    :aria-label="text"
    @click="handleClick"
  >
    <div v-if="icon" :class="icon" />
    <div flex="~ col">
      <div text-15px>
        <slot>
          {{ text }}
        </slot>
      </div>
      <div text-3 text-secondary>
        <slot name="description">
          <p v-if="description">
            {{ description }}
          </p>
        </slot>
      </div>
    </div>

    <div flex-auto />

    <div v-if="checked" i-ri:check-line />
    <slot name="actions" />
  </component>
</template>
