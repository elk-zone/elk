<script setup lang="ts">
defineProps<{
  icon?: string
  text?: string
  checked: boolean
}>()
</script>

<template>
  <button
    exact-active-class="text-primary"
    block w-full group focus:outline-none text-start
  >
    <div
      w-full flex w-fit px5 py3 md:gap2 gap4 items-center
      transition-250 group-hover:bg-active
      group-focus-visible:ring="2 current"
    >
      <div flex-1 flex items-center md:gap2 gap4>
        <div
          v-if="icon" flex items-center justify-center
          flex-shrink-0
          :class="$slots.description ? 'w-12 h-12' : ''"
        >
          <slot name="icon">
            <div v-if="icon" :class="icon" md:text-size-inherit text-xl />
          </slot>
        </div>
        <div space-y-1>
          <p :class="checked ? 'text-base' : 'text-secondary'">
            <slot>
              <span>{{ text }}</span>
            </slot>
          </p>
          <p v-if="$slots.description" text-sm text-secondary>
            <slot name="description" />
          </p>
        </div>
      </div>
      <div text-lg :class="checked ? 'i-ri-checkbox-line text-primary' : 'i-ri-checkbox-blank-line text-secondary'" />
    </div>
  </button>
</template>
