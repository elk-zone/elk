<script setup lang="ts">
const props = defineProps<{
  name: string
}>()

const isMac = useIsMac()

const keys = computed(() => props.name.toLowerCase().split('+'))
</script>

<template>
  <div class="flex items-center px-1">
    <template v-for="(key, index) in keys" :key="key">
      <div v-if="index > 0" class="inline-block px-.5">
        +
      </div>
      <div
        class="p-1 grid place-items-center rounded-lg shadow-sm"
        text="xs secondary"
        border="1 base"
      >
        <div v-if="key === 'enter'" i-material-symbols:keyboard-return-rounded />
        <div v-else-if="key === 'meta' && isMac" i-material-symbols:keyboard-command-key />
        <div v-else-if="key === 'meta' && !isMac" i-material-symbols:window-sharp />
        <div v-else-if="key === 'alt' && isMac" i-material-symbols:keyboard-option-key-rounded />
        <div v-else-if="key === 'arrowup'" i-ri:arrow-up-line />
        <div v-else-if="key === 'arrowdown'" i-ri:arrow-down-line />
        <div v-else-if="key === 'arrowleft'" i-ri:arrow-left-line />
        <div v-else-if="key === 'arrowright'" i-ri:arrow-right-line />
        <template v-else-if="key === 'escape'">
          ESC
        </template>
        <div v-else :class="{ 'px-.5': key.length === 1 }">
          {{ key[0].toUpperCase() + key.slice(1) }}
        </div>
      </div>
    </template>
  </div>
</template>
