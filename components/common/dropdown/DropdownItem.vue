<script setup lang="ts">
const {
  is = 'div',
  text,
  description,
  icon,
  checked,
  command,
} = defineProps<{
  is?: string
  text?: string
  description?: string
  icon?: string
  checked?: boolean
  command?: boolean
}>()

const emit = defineEmits(['click'])

const type = computed(() => is === 'button' ? 'button' : null)

const { hide } = useDropdownContext() || {}

const el = ref<HTMLDivElement>()

function handleClick(evt: MouseEvent) {
  hide?.()
  emit('click', evt)
}

useCommand({
  scope: 'Actions',

  order: -1,
  visible: () => command && text,

  name: () => text!,
  icon: () => icon ?? 'i-ri:question-line',
  description: () => description,

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
    :type="type"
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
